import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, UploadCloud, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/contexts/ThemeContext";

interface CodeEditorModalProps {
  questionTitle?: string;
  onClose: () => void;
}

export default function CodeEditorModal({
  questionTitle,
  onClose,
}: CodeEditorModalProps) {
  const { theme } = useTheme();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [testCases, setTestCases] = useState([
    { input: "1 2", expected: "3", result: "" },
    { input: "4 5", expected: "9", result: "" },
    {
      input:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non.",
      expected: "Lorem ipsum result",
      result: "",
    },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef<any>(null);

  const starterCode: Record<string, string> = {
    python: `def solution():\n    pass\n\nresult = solution()\nprint(result)`,
    javascript: `function solution() {\n}\n\nconst result = solution();\nconsole.log(result);`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}`,
  };

  useEffect(() => {
    setCode(starterCode[language]);
  }, [language]);

  useEffect(() => {
    const timeout = setTimeout(() => editorRef.current?.layout(), 300);
    return () => clearTimeout(timeout);
  }, []);

  const runCode = () => {
    setIsRunning(true);
    setOutput("");
    setTimeout(() => {
      setOutput(`// Mock output for ${language}\nCode ran successfully!`);
      setTestCases((prev) => prev.map((tc) => ({ ...tc, result: tc.expected })));
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Full window container */}
      <div className="w-full max-w-[1400px] h-[90vh] flex border border-border shadow-xl rounded-lg overflow-hidden bg-background">
        {/* Left: Editor and Description */}
        <div className="flex flex-col flex-1 overflow-hidden p-4 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {questionTitle || "Code Editor"}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X />
            </Button>
          </div>

          {/* Problem Description (scrollable if huge) */}
          <ScrollArea className="max-h-40 rounded-md border border-border bg-muted/40 p-3">
            <p className="text-sm leading-relaxed">
              <strong>Problem Description:</strong> You are given two integers
              A and B. Your task is to write a function that returns their sum.
              <br />
              <br />
              <strong>Input Format:</strong> Two space-separated integers A and
              B.
              <br />
              <strong>Output Format:</strong> A single integer representing the
              sum of A and B.
              <br />
              <strong>Example:</strong>
              <br />
              Input: <code>4 5</code>
              <br />
              Output: <code>9</code>
              <br />
              <br />
              <strong>Note:</strong> Handle edge cases such as negative numbers,
              large integers, or invalid inputs gracefully.
              <br />
              <br />
              {/* Extra dummy text to demonstrate scroll */}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              interdum lorem vel libero pharetra, vitae tincidunt nulla
              facilisis. Donec tincidunt nisi id justo volutpat, vel volutpat
              velit accumsan. Sed aliquet, urna eget aliquam finibus, ligula
              lorem elementum ante, vitae feugiat mi libero nec justo. Integer
              at tincidunt elit, ac dapibus lacus. Duis porttitor nulla ac
              finibus lacinia. Curabitur nec eros vel metus finibus facilisis.
            </p>
          </ScrollArea>

          {/* Language + Run */}
          <div className="flex gap-2 items-center">
            <Select
              value={language}
              onValueChange={(v) => setLanguage(v)}
              className="flex-shrink-0"
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={runCode}
              disabled={isRunning}
              className="w-24 flex-shrink-0 gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? "Running..." : "Run"}
            </Button>
              <Button
              onClick={runCode}
              disabled={isRunning}
              className="w-24 flex-shrink-0 gap-2 bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600 text-white"
            >
              <UploadCloud className="h-4 w-4 " />
              {isRunning ? "Submitting..." : "Submit"}
            </Button>
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-hidden rounded-md border">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              onChange={(val) => setCode(val || "")}
              onMount={(editor) => (editorRef.current = editor)}
              theme={theme === "dark" ? "vs-dark" : "light"}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                automaticLayout: true,
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </div>

        {/* Right Panel: Output + Test Cases */}
        <div className="w-1/3 flex flex-col border-l border-border p-4 gap-4 overflow-hidden">
          {/* Output Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <h3 className="font-semibold mb-1">Output</h3>
            <ScrollArea className="flex-1 rounded-md border bg-background">
              <pre className="text-sm font-mono whitespace-pre-wrap p-2">
                {output || "// Output will appear here"}
              </pre>
            </ScrollArea>
          </div>

          {/* Test Cases Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <h3 className="font-semibold mb-2">Test Cases</h3>

            {/* Large scrollable card containing all test cases */}
            <ScrollArea className="flex-1">
              <Card className="flex flex-col gap-4 p-3 bg-muted/50">
                {testCases.map((tc, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <h4 className="text-sm font-semibold">
                      Test Case {idx + 1}
                    </h4>
                    <div className="p-2 rounded-md border border-border bg-background shadow-sm">
                      <p className="text-xs font-semibold">Input:</p>
                      <pre className="text-xs font-mono whitespace-pre-wrap">
                        {tc.input}
                      </pre>

                      <p className="text-xs font-semibold mt-1">Expected:</p>
                      <pre className="text-xs font-mono whitespace-pre-wrap">
                        {tc.expected}
                      </pre>

                      <p className="text-xs font-semibold mt-1">Result:</p>
                      <pre className="text-xs font-mono whitespace-pre-wrap">
                        {tc.result || "-"}
                      </pre>
                    </div>
                  </div>
                ))}
              </Card>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
