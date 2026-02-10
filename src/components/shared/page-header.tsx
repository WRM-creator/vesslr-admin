interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  endContent?: React.ReactNode;
}

export const PageHeader = ({
  title,
  description,
  endContent,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col-reverse justify-between gap-2 @2xl:flex-row @2xl:items-center">
      <div className="space-y-1">
        <h1 className="text-[24px] leading-[1.45] font-semibold">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      {endContent && <div className="ml-auto w-fit @2xl:m-0">{endContent}</div>}
    </div>
  );
};
