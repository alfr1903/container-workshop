interface TitleProps {
  text: string;
}

export default function ({ text }: TitleProps) {
  return (
    <div>
      <h1>{text}</h1>
    </div>
  );
}
