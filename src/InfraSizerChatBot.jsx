import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const questions = [
  'Hey there! What is your use case? ',
  'Awesome! Are you using inference, fine-tuning, or retraining?',
  'Cool! What type of data will your model process? (Text, Image, Audio, Video)',
  'Got it! What is the expected number of total users?',
  'And how many users will use it concurrently?',
  'Nice! How many queries per hour do you expect?',
  'What is your desired response accuracy? (Low, Medium, High)',
  'What is your latency requirement (in ms or sec)?',
  'Almost done! What is your prompting strategy? (Chain-of-Thought, Contextual)',
  'Last one! What model are you planning to use? (LLAMA3 8B, CoPilot, Azure OpenAI, etc.)'
];

export default function InfraSizerChatbot() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState('');
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleNext = () => {
    if (!input.trim()) return;
    setAnswers([...answers, input]);
    setInput('');
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setReportGenerated(true);
    }
  };

  const downloadReport = () => {
    const doc = new jsPDF();

    const sections = [
      ['Project Overview', [
        ['Language Support', 'English & Japanese'],
        ['Model Size', answers[9]],
        ['Architecture', 'RAG (Retrieval-Augmented Generation)'],
        ['Concurrent Users', answers[4]],
        ['Input Tokens', '~200'],
        ['Output Tokens', 'Up to 4000'],
        ['Document Store', 'Word, PDF, PPT with tables/images']
      ]],
      ['Assumptions', [
        ['Quantized model', 'GGUF INT4/INT8'],
        ['Tokenization time', '~10ms per 1K tokens'],
        ['RAG DB', 'FAISS/Weaviate'],
        ['OCR', 'Tesseract/LayoutLM'],
        ['Frameworks', 'LangChain / Haystack'],
        ['Memory per instance', '~24GB RAM'],
        ['Threads per user', '2 vCPUs']
      ]],
      ['Infra Sizing - Compute', [
        ['CPU', 'Intel Xeon Gold 64B (x2 nodes)'],
        ['Logical Cores', '128'],
        ['RAM', '512GB DDR5 ECC'],
        ['Storage', '2x 2TB NVMe SSDs'],
        ['OS', 'Ubuntu 24.04 LTS']
      ]],
      ['Storage', [
        ['RAG DB', '200GB'],
        ['Vector Index', '200GB'],
        ['Logs', '200GB'],
        ['Total', '~1TB (RAID 1/Me)']
      ]],
      ['Network', [['Recommended Bandwidth', '10 Gbps']]]
    ];

    sections.forEach(([title, rows], index) => {
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      if (index !== 0) doc.addPage();
      doc.text(title, 14, 20);
      autoTable(doc, {
        startY: 25,
        head: [['Key', 'Value']],
        body: rows,
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [240, 240, 240] }
      });
    });

    doc.save('Infra_Sizer_Report.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6 p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center text-slate-800">Infra Sizer Chatbot</h1>
        <Card>
          <CardContent className="p-6 space-y-6">
            {!reportGenerated ? (
              <>
                <div className="text-lg font-semibold text-gray-700">
                  {questions[currentQuestion]}
                </div>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your answer here..."
                />
                <Button onClick={handleNext} className="w-full">
                  {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-green-600 text-center">🎉 Your Report is Ready!</h2>
                <div className="bg-white p-6 rounded-lg shadow-inner border border-gray-300 text-sm space-y-6">
                  {[{
                    title: 'Project Overview', content: [
                      `Language Support: English & Japanese`,
                      `Model Size: ${answers[9]}`,
                      `Architecture: RAG (Retrieval-Augmented Generation)`,
                      `Concurrent Users: ${answers[4]}`,
                      `Input Tokens: ~200`,
                      `Output Tokens: Up to 4000`,
                      `Document Store: PDF, Word, PPT with tables/images`
                    ]
                  }, {
                    title: 'Assumptions', content: [
                      `Quantized model (GGUF INT4/INT8)`,
                      `Tokenization time ~10ms per 1K tokens`,
                      `RAG DB: FAISS/Weaviate`,
                      `OCR: Tesseract/LayoutLM`,
                      `LangChain or Haystack`,
                      `Memory per instance: ~24GB RAM`,
                      `Threads per user: 2 vCPUs`
                    ]
                  }, {
                    title: 'Infra Sizing - Compute', content: [
                      `Intel Xeon Gold (64-threads) x2 nodes`,
                      `Logical Cores: 128`,
                      `RAM: 512GB DDR5 ECC`,
                      `Storage: 2x 2TB NVMe`,
                      `OS: Ubuntu 24.04 LTS`
                    ]
                  }, {
                    title: 'Storage', content: [
                      `RAG DB: 200GB`,
                      `Vector Index: 200GB`,
                      `Logs: 200GB`,
                      `Total: ~1TB (RAID 1/Me)`
                    ]
                  }, {
                    title: 'Network', content: [
                      `10 Gbps`
                    ]
                  }].map((section, i) => (
                    <div key={i} className="space-y-2">
                      <h3 className="text-md font-bold text-slate-700 border-b pb-1">{section.title}</h3>
                      <ul className="list-disc ml-6 text-gray-700">
                        {section.content.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <Button onClick={downloadReport} className="w-full bg-green-600 hover:bg-green-700">
                  Download Report (PDF)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
