import React from 'react';

export default function MarathonDescription({description}) {
  const lines = description.split('\n');

  return (
    <>
      {lines.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </>
  );
}
