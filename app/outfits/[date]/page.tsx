export default async function OutfitDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">착장 상세: {date}</h1>
      <p className="text-sm text-muted-foreground">
        날짜별 착장 상세 화면 (Task 015/017에서 구현)
      </p>
    </div>
  );
}
