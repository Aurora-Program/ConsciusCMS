import React from "react";
import Card from "../components/CardA";

type Item = {
  icon?: string;
  title: string;
  desc: string;
};

type FeatureGridProps = {
  items: Item[];
};

export default function FeatureGrid({ items }: FeatureGridProps) {
  return (
    <section className="feature-grid">
      <div className="o-container feature-grid__grid">
        {items?.map((it) => (
          <Card key={it.title} title={`${it.icon ? it.icon + " " : ""}${it.title}`}>
            <p>{it.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}