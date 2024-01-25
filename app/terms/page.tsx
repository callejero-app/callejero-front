import React from "react";
import logo from "@/public/images/callejero-dark.png";

function Terms() {
  return (
    <div
      className="terms"
      style={{
        // backgroundImage: `url("/images/callejero-dark.png")`,
        background: `url("/images/callejero-dark.png")`,
        // backgroundColor: "rgba(255, 255, 255, 0.9)",
        backgroundRepeat: "space",
        // backgroundSize: "contain",
      }}
    >
      <div
        className="pt-12 w-4/5 mx-auto"
        style={{
          background: "white",
          opacity: ".95",
          width: "100%",
          padding: "2rem 4rem",
        }}
      >
        <h1 className="text-5xl text-callejero font-bold">
          Terms and Condition
        </h1>
        <p className="text-lg mt-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam tempora
          totam officiis, ipsam enim natus optio ab delectus eum quibusdam
          voluptatem molestias, quaerat commodi, sapiente autem iure? Harum,
          molestiae perspiciatis?.Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Ullam tempora totam officiis, ipsam enim natus optio
          ab delectus eum quibusdam voluptatem molestias, quaerat commodi,
          sapiente autem iure? Harum, molestiae perspiciatis?.
        </p>
        <h2 className="mt-6 text-4xl text-callejero font-bold">Title</h2>
        <p className="text-lg mt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam tempora
          totam officiis, ipsam enim natus optio ab delectus eum quibusdam
          voluptatem molestias, quaerat commodi, sapiente autem iure? Harum,
          molestiae perspiciatis?. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Ullam tempora totam officiis, ipsam enim natus optio
          ab delectus eum quibusdam voluptatem molestias, quaerat commodi,
          sapiente autem iure? Harum, molestiae perspiciatis?
        </p>
        <h3 className="mt-4 text-2xl text-callejero font-bold">Subtitle</h3>
        <p className="text-lg mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam tempora
          totam officiis, ipsam enim natus optio ab delectus eum quibusdam
          voluptatem molestias, quaerat commodi, sapiente autem iure? Harum,
          molestiae perspiciatis?.
        </p>
        <h3 className="mt-4 text-2xl text-callejero font-bold">Subtitle 2</h3>
        <p className="text-lg mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam tempora
          totam officiis, ipsam enim natus optio ab delectus eum quibusdam
          voluptatem molestias, quaerat commodi, sapiente autem iure? Harum,
          molestiae perspiciatis?.
        </p>
      </div>
    </div>
  );
}

export default Terms;
