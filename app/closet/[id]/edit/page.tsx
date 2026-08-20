export default async function EditClothingItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">옷 아이템 수정: {id}</h1>
      <p className="text-sm text-muted-foreground">
        아이템 수정 화면 (Task 013에서 구현)
      </p>
    </div>
  );
}
