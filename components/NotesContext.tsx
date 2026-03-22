import { createContext, ReactNode, useContext, useState } from 'react';

export type Note = {
  id: string;
  title: string;
  content: string;
};

type NotesContextType = {
  notes: Note[];
  addNote: (title: string, content: string) => void;
  getNoteById: (id: string) => Note | undefined;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);

  function addNote(title: string, content: string) {
    const newNote: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
    };

    setNotes((previousNotes) => [newNote, ...previousNotes]);
  }

  function getNoteById(id: string) {
    return notes.find((note) => note.id === id);
  }

  return (
    <NotesContext.Provider value={{ notes, addNote, getNoteById }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error('useNotes must be used inside NotesProvider');
  }

  return context;
}