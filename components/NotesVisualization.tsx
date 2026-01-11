interface Note {
  id: string;
  name: string;
  category: string;
  intensity?: number;
}

interface NotesVisualizationProps {
  notes: Note[];
}

export default function NotesVisualization({ notes }: NotesVisualizationProps) {
  const topNotes = notes.filter((n) => n.category === "top");
  const heartNotes = notes.filter((n) => n.category === "heart");
  const baseNotes = notes.filter((n) => n.category === "base");

  const NoteTag = ({ note }: { note: Note }) => (
    <span
      className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
      style={{
        opacity: note.intensity ? 0.5 + (note.intensity / 10) : 0.8,
      }}
    >
      {note.name}
    </span>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Fragrance Notes</h3>
        <p className="text-gray-600">Discover the layered scent profile</p>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-mint via-accent-lavender to-accent-rose -translate-x-1/2"></div>

        <div className="space-y-12">
          {topNotes.length > 0 && (
            <div className="relative">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-accent-mint/20 backdrop-blur-sm px-6 py-2 rounded-full border-2 border-accent-mint/30">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Top Notes
                  </h4>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {topNotes.map((note) => (
                  <span
                    key={note.id}
                    className="px-4 py-2 bg-accent-mint/30 text-gray-800 rounded-full text-sm font-medium hover:bg-accent-mint/50 transition-all"
                  >
                    {note.name}
                  </span>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-3">
                Initial impression • Lasts 15-30 minutes
              </p>
            </div>
          )}

          {heartNotes.length > 0 && (
            <div className="relative">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-accent-lavender/20 backdrop-blur-sm px-6 py-2 rounded-full border-2 border-accent-lavender/30">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Heart Notes
                  </h4>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {heartNotes.map((note) => (
                  <span
                    key={note.id}
                    className="px-4 py-2 bg-accent-lavender/30 text-gray-800 rounded-full text-sm font-medium hover:bg-accent-lavender/50 transition-all"
                  >
                    {note.name}
                  </span>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-3">
                Core character • Lasts 2-4 hours
              </p>
            </div>
          )}

          {baseNotes.length > 0 && (
            <div className="relative">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-accent-rose/20 backdrop-blur-sm px-6 py-2 rounded-full border-2 border-accent-rose/30">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Base Notes
                  </h4>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {baseNotes.map((note) => (
                  <span
                    key={note.id}
                    className="px-4 py-2 bg-accent-rose/30 text-gray-800 rounded-full text-sm font-medium hover:bg-accent-rose/50 transition-all"
                  >
                    {note.name}
                  </span>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-3">
                Lasting impression • Lasts 4-6+ hours
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
