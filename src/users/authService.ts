// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AssociateSoftwareTokenCommand,  CognitoIdentityProviderClient, SetUserMFAPreferenceCommand, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand, ForgotPasswordCommand, ConfirmForgotPasswordCommand,RespondToAuthChallengeCommand,ChangePasswordCommand, VerifySoftwareTokenCommand } from "@aws-sdk/client-cognito-identity-provider";
import { calculateSrpA, computeSrpSignature } from "./srpHelper"; 

import axios
 from "axios";
const url = import.meta.env.VITE_URL_API_LOGINS
const clientID = import.meta.env.VITE_CLIENT_ID
const region = import.meta.env.VITE_REGION


export const cognitoClient = new CognitoIdentityProviderClient({
  region: region,
});

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

function base64Encode(input) {
  const encoder = new TextEncoder();
  const encodedInput = encoder.encode(input); // Converts string to Uint8Array
  return btoa(String.fromCharCode.apply(null, encodedInput)); // Converts to Base64 string
}




export const provideSoftwareTokenLogin = async (username: string,  code: string, session: string) =>{
  const params = {
    ChallengeName: 'SOFTWARE_TOKEN_MFA',
    ClientId: clientID,
    Session: session,

    ChallengeResponses: {
      USERNAME: username,
      SOFTWARE_TOKEN_MFA_CODE: code
    }
  };
  try {
    const command = new RespondToAuthChallengeCommand(params);
    const res = await cognitoClient.send(command);
    console.log("Authentication sucesful");
    if (res.AuthenticationResult) {
      sessionStorage.setItem("idToken", res.AuthenticationResult.IdToken || '');
      sessionStorage.setItem("accessToken", res.AuthenticationResult.AccessToken || '');
      sessionStorage.setItem("refreshToken", res.AuthenticationResult.RefreshToken || '');
      
    }  
    return res;
  } catch (error) {
    console.error("Error error with 2FA: ", error);
    throw error;
  }

}


export const acceptEula = async(username: string)=>{

  const url = import.meta.env.VITE_URL_API_SETTINGSSEC
  const data1 = {Area:username, Setting:"eulaAccpted",  Value: true }
  const data2 = {Area:username, Setting:"eulaAccptedDate",  Value: Date() }
  const config = {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
           Authorization : `Bearer ${sessionStorage.getItem("accessToken")}`
      },  
      }
  var ret =[]
  ret.push( await axios.post( url,data1,config ));
  ret.push ( await axios.post( url,data2,config ));
  return ret

  }


export const firstLogin = async (username: string,  password: string,  session:string ) =>{
  const params = {
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    ClientId: clientID,

    ChallengeResponses: {
      USERNAME: username,
      NEW_PASSWORD: password
    },
    Session: session
  };
  try {
    const command = new RespondToAuthChallengeCommand(params);
    await  cognitoClient.send(command);
    console.log("User set the password successfully");
    return true;
  } 
  
  catch (error) {
    console.error("Error resetting password: ", error);
    throw error;
  }
}

function getFormattedTimestamp() {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const now = new Date();
  const dayOfWeek = daysOfWeek[now.getUTCDay()];
  const month = months[now.getUTCMonth()];
  const day = now.getUTCDate();
  const year = now.getUTCFullYear();
  const hours = now.getUTCHours().toString().padStart(2, "0");
  const minutes = now.getUTCMinutes().toString().padStart(2, "0");
  const seconds = now.getUTCSeconds().toString().padStart(2, "0");

  // Format the date string to match Cognito's expected format
  return `${dayOfWeek} ${month} ${day} ${hours}:${minutes}:${seconds} UTC ${year}`;
}

export const checkAccessTokenExpiration =  async () => {

  const accessToken = sessionStorage.getItem("accessToken")
  const claims =parseJwt(accessToken)
 
  const exp = claims.exp
  try {

  if (exp < new Date().getTime()/1000)   
    { 
      const params = {
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: import.meta.env.VITE_CLIENT_ID,
        AuthParameters: {
          REFRESH_TOKEN: sessionStorage.getItem("refreshToken")
        },
      };
   
        const command = new InitiateAuthCommand(params);
        const res = await cognitoClient.send(command);
        
        console.log(res)
        res.$metadata
    
        // const { AuthenticationResult } = await cognitoClient.send(command);
        if (res.AuthenticationResult) {
          sessionStorage.setItem("idToken", res.AuthenticationResult.IdToken || '');
          sessionStorage.setItem("accessToken", res.AuthenticationResult.AccessToken || '');
        }  
        return res
    }
    else{
    }
}
catch(error){
  console.log(error)
}
}

export const changePassword = async ( oldPassword, newPassword) => {
  const input = {
    AccessToken: sessionStorage.getItem("accessToken"),
    PreviousPassword: oldPassword,
    ProposedPassword: newPassword,
  };

  const command = new ChangePasswordCommand(input);

  try {
    const response = await cognitoClient.send(command);
    console.log("Password changed successfully:", response);
  } catch (error) {
    console.error("Error changing password:", error);
    throw error
 
  }
};

export const signIn = async (username: string, password: string) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: import.meta.env.VITE_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };
  try {
    const command = new InitiateAuthCommand(params);
    const res = await cognitoClient.send(command);
    
    console.log(res)
    res.$metadata

    //To Do: Confirm that user accept the eula.

    // const { AuthenticationResult } = await cognitoClient.send(command);
    if (res.AuthenticationResult) {
      sessionStorage.setItem("idToken", res.AuthenticationResult.IdToken || '');
      sessionStorage.setItem("accessToken", res.AuthenticationResult.AccessToken || '');
      sessionStorage.setItem("refreshToken", res.AuthenticationResult.RefreshToken || '');
      
    }  

    return res


  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
};


export const signIn2 = async (username, password) => {
  const srpA = calculateSrpA();
  
  // Ensure srpA and other values are defined and in correct format
  console.log("SRP A value:", srpA);
  console.log("Username:", username);
  
  const params = {
    AuthFlow: "USER_SRP_AUTH",
    ClientId: import.meta.env.VITE_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      SRP_A: srpA.A.toString(16), // Ensure this is a string
    },
  };

  try {
    // Step 1: Initiate auth with SRP_A
    const command = new InitiateAuthCommand(params);
    const res = await cognitoClient.send(command);

    if (res.ChallengeName === "PASSWORD_VERIFIER") {
      // Step 2: Respond to challenge with computed SRP signature
      const challengeParams = res.ChallengeParameters;
      const srpSignature = computeSrpSignature(username, password, challengeParams);

      console.log("Challenge Parameters:", challengeParams);
      console.log("Computed SRP Signature:", srpSignature);

      const base64Signature = base64Encode(srpSignature);

      console.log("Base64 Encoded SRP Signature:", base64Signature);

      const challengeResponse = {
        ChallengeName: "PASSWORD_VERIFIER",
        ClientId: import.meta.env.VITE_CLIENT_ID,
        ChallengeResponses: {
          USERNAME: username,
          PASSWORD_CLAIM_SIGNATURE: base64Signature, // Convert signature to string
          PASSWORD_CLAIM_SECRET_BLOCK: challengeParams.SECRET_BLOCK,
          TIMESTAMP: getFormattedTimestamp(),
        },
      };

      const authCommand = new RespondToAuthChallengeCommand(challengeResponse);
      const authResult = await cognitoClient.send(authCommand);



      if (authResult.AuthenticationResult) {
        sessionStorage.setItem("idToken", authResult.AuthenticationResult.IdToken || "");
        sessionStorage.setItem("accessToken", authResult.AuthenticationResult.AccessToken || "");
        sessionStorage.setItem("refreshToken", authResult.AuthenticationResult.RefreshToken || "");
      }

      return authResult;
    }
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};


export const signOut = async  () => {
    sessionStorage.setItem("idToken", '');
    sessionStorage.setItem("accessToken", '');
    sessionStorage.setItem("refreshToken",  '');
}

export const signUp = async (email: string, password: string, name:string) => {
  const params = {
    ClientId: import.meta.env.CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "name",
        Value: name,
      }
    ],
  };
  try {
    const command = new SignUpCommand(params);
    const response = await cognitoClient.send(command);
    console.log("Sign up success: ", response);
    return response;
  } catch (error) {
    console.error("Error signing up: ", error);
    throw error;
  }
};

export const confirmSignUp = async (username: string, code: string) => {
  const params = {
    ClientId: clientID,
    Username: username,
    ConfirmationCode: code,
  };
  try {
    const command = new ConfirmSignUpCommand(params);
    await cognitoClient.send(command);
    console.log("User confirmed successfully");
    return true;
  } catch (error) {
    console.error("Error confirming sign up: ", error);
    throw error;
  }
};


export const confirmForgotPassword = 
async (username: string, password: string, code: string ) => {
  const params = {
    ClientId: clientID,
    Username: username,
    Password: password,
    ConfirmationCode: code
   
  };
  try {
    const command = new ConfirmForgotPasswordCommand(params);
    await  cognitoClient.send(command);
    console.log("User reset the password successfully");
    return true;
  } catch (error) {
    console.error("Error resetting password: ", error);
    throw error;
  }
};

export const forgotPassword = 
async (username: string) => {
  const params = {
    ClientId: clientID,
    Username: username,
   
  };
  try {
    const command = new ForgotPasswordCommand(params);
    await cognitoClient.send(command);
    console.log("User confirmed successfully");
    return true;
  } catch (error) {
    console.error("Error confirming sign up: ", error);
    throw new Error(error);
  }
};


export async function getLogins(){
  const config = {
      headers: {
           Authorization : `Bearer ${sessionStorage.getItem("accessToken")}`
      }
  };
  const res = await axios.get( url, config );
  let temp = []
  res['data'].Items.map((i)=> {
    console.log(i)
    const t = new Date (i.time)
    temp.push(t)})
  
  return temp.sort((a,b) => a -b)



  }


  export async function verifySoftwareMFA(mfaCode){

  

    try {

      const params = {
        "AccessToken":sessionStorage.getItem("accessToken"),
        "UserCode": mfaCode

     }

      const command = new VerifySoftwareTokenCommand(params);
      await cognitoClient.send(command);
      console.log("Changed");
      return true;
    } catch (error) {
      console.error("Error confirming sign up: ", error);
      throw new Error(error);
    }
  };





  export async function setSoftwareMFA(status){

  

    try {

      const params = {
        "AccessToken":sessionStorage.getItem("accessToken") 
     }

      const command = new AssociateSoftwareTokenCommand(params);
      const ret = await cognitoClient.send(command);
      console.log(ret);
      return ret.SecretCode;
    } catch (error) {
      console.error("Error confirming sign up: ", error);
      throw new Error(error);
    }
  };


  


  export async function setMFA(status){

  

      try {

        const params = {
          "AccessToken":sessionStorage.getItem("accessToken") ,
          "EmailMfaSettings": { 
             "Enabled": false ,
             "PreferredMfa": false
          },
          "SMSMfaSettings": { 
             "Enabled": false,
             "PreferredMfa": false
          },
          "SoftwareTokenMfaSettings": { 
             "Enabled": status,
             "PreferredMfa": false
          }
       }

        const command = new SetUserMFAPreferenceCommand(params);
        await cognitoClient.send(command);
        console.log("Changed");
        return true;
      } catch (error) {
        console.error("Error confirming sign up: ", error);
        throw new Error(error);
      }
    };
