import PlateEditor from "@/components/plate-ui/plate-editor";

export default function EditorPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="max-w-[1336px] rounded-lg border bg-background shadow">
        <PlateEditor />
      </div>
    </section>
  );
}
