import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";
import { deleteNote } from "@/lib/api";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
  mutationFn: (noteId: string) => deleteNote(noteId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  },
});

  const handleDelete = (noteId: string) => {
  if (confirm("Ви дійсно хочете видалити нотатку?")) {
    deleteNoteMutation.mutate(String(noteId));
  }
};

  if (!notes.length) {
    return <p>Нотаток поки що немає.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
               className={css.button}
            onClick={() => handleDelete(note.id)}
            disabled={deleteNoteMutation.status === "pending"}
>
  {deleteNoteMutation.status === "pending" ? "Видаляємо..." : "Delete"}
</button>

          </div>
        </li>
      ))}
    </ul>
  );
}
