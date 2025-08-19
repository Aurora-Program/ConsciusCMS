const LanguageSelector = (props) =>

    {         

        return (
            <>
            { 
               
                props.language == "ES" ? 
                <span >
               <button className='languageSelector'  onClick={()=>{localStorage.setItem('language', "EN");  props.onSelect("EN")}} >En</button> <span className="languageSelected">/</span><button className='languageSelector'  onClick={()=>{localStorage.setItem('language', "CAT");  props.onSelect("CAT")}} >Cat</button> 
                </span>
                :
                <>
                { 
                props.language == "EN" ? 
                <span>
                
                <button className='languageSelector'  onClick={()=>{localStorage.setItem('language', "ES");  props.onSelect("ES")}} >Es</button><span className="languageSelected">/</span><button className='languageSelector'  onClick={()=>{localStorage.setItem('language', "CAT"); props.onSelect("CAT")}} >Cat</button> 
                </span>
                :
                <span>
                <button className='languageSelector'  onClick={()=>{localStorage.setItem('language', "ES");  props.onSelect("ES")}} >Es</button><span className="languageSelected">/</span><button className='languageSelector'  onClick={()=>{localStorage.setItem('language', "EN");  props.onSelect("EN")}} >En</button>
                </span>
                }
                </>
                }
          </>)
    }

    export default LanguageSelector