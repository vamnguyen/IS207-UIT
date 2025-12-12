interface DividerProps {
  text?: string;
}

const Divider = ({ text = "or" }: DividerProps) => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-4 text-muted-foreground font-medium">
          {text}
        </span>
      </div>
    </div>
  );
};

export default Divider;