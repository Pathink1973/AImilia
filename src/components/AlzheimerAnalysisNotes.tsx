import React, { useState, useEffect } from 'react';
import { Brain, Calendar, Activity, AlertTriangle } from 'lucide-react';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: string;
}

interface AnalysisNote {
  id: string;
  timestamp: string;
  cognitiveScore: number;
  activityLevel: string;
  concerns: string[];
  notes: string;
}

interface Props {
  messages: Message[];
}

export default function AlzheimerAnalysisNotes({ messages }: Props) {
  const [notes, setNotes] = useState<AnalysisNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [cognitiveScore, setCognitiveScore] = useState<number>(5);
  const [activityLevel, setActivityLevel] = useState<string>('normal');
  const [concerns, setConcerns] = useState<string[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('alzheimerAnalysisNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('alzheimerAnalysisNotes', JSON.stringify(notes));
  }, [notes]);

  const saveNote = () => {
    if (!newNote.trim()) return;

    const note: AnalysisNote = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('pt-PT'),
      cognitiveScore,
      activityLevel,
      concerns,
      notes: newNote
    };

    setNotes(prev => [note, ...prev]);
    setNewNote('');
    setCognitiveScore(5);
    setActivityLevel('normal');
    setConcerns([]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold">Análise de Alzheimer</h2>
      </div>

      <div className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Nível Cognitivo (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={cognitiveScore}
                onChange={(e) => setCognitiveScore(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Nível de Atividade</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="baixo">Baixo</option>
                <option value="normal">Normal</option>
                <option value="alto">Alto</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Preocupações</label>
            <input
              type="text"
              placeholder="Adicione preocupações separadas por vírgula"
              value={concerns.join(', ')}
              onChange={(e) => setConcerns(e.target.value.split(',').map(s => s.trim()))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notas</label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Adicione suas observações..."
              className="w-full p-2 border rounded h-24"
            />
          </div>

          <button
            onClick={saveNote}
            className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Salvar Nota
          </button>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{note.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <span>Nível Cognitivo: {note.cognitiveScore}/10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span>Atividade: {note.activityLevel}</span>
                  </div>
                  {note.concerns.length > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span>Preocupações: {note.concerns.join(', ')}</span>
                    </div>
                  )}
                  <p className="mt-2">{note.notes}</p>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}