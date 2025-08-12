import { fetchNoteById } from "@/lib/api";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";

type NoteDetailsProps = {
    params: { id: string };
};

const NoteDetails = async ({ params }: NoteDetailsProps) => {
    const { id } = params;

    const queryClient = new QueryClient();

    // Якщо дані вже є в кеші — не робимо повторний запит
    if (!queryClient.getQueryData(["note", id])) {
        try {
            await queryClient.prefetchQuery({
                queryKey: ["note", id],
                queryFn: () => fetchNoteById(id),
            });
        } catch (error) {
            console.error("Помилка завантаження нотатки:", error);
            // Можна вивести якийсь fallback компонент
        }
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NoteDetailsClient id={id} />
        </HydrationBoundary>
    );
};

export default NoteDetails;
