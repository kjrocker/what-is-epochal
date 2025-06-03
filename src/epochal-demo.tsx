import { epochize } from "epochal";
import {
  batch,
  createSignal,
  For,
  Match,
  Show,
  Switch,
} from "solid-js";

interface HistoryItem {
  id: string;
  input: string;
  result: [Date, Date] | null;
  timestamp: Date;
}

export default function EpochalDemo() {
  const [input, setInput] = createSignal("1st century BC");
  const [history, setHistory] = createSignal<HistoryItem[]>([]);

  const result = () => epochize(input());

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (input().trim()) {
      batch(() => {
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          input: input().trim(),
          result: result(),
          timestamp: new Date(),
        };
        setHistory((prev) => [newItem, ...prev]);
        setInput("");
      });
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      era: "short"
    });
  };

  return (
    <div class="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      {/* Background gradient */}
      <div class="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />

      <div class="relative z-10 container mx-auto px-6 py-12 flex-1 flex flex-col">
        {/* Dynamic Header */}
        <div class="text-center mb-16">
          <h1 class="text-8xl md:text-9xl font-black mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            EPOCHAL
          </h1>
          <p class="text-2xl md:text-3xl font-light text-gray-300 tracking-wide">
            String → Time
          </p>
        </div>

        <div class="max-w-4xl w-full mx-auto flex flex-col">
          {/* Centered Input */}
          <form onSubmit={handleSubmit} class="mb-12 w-full">
            <div class="relative w-full">
              <input
                value={input()}
                onInput={(e) => setInput(e.currentTarget.value)}
                placeholder="Enter any string..."
                class="w-full text-2xl md:text-3xl py-8 px-8 bg-white/10 border-2 border-white/20 rounded-2xl backdrop-blur-sm text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300 outline-none"
              />
              <button
                type="submit"
                disabled={!input().trim()}
                class="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                SAVE
              </button>
            </div>
          </form>

          {/* Result Display */}
          <div class="text-center mb-16 flex-1 flex items-center justify-center">
            <Switch
              fallback={
                <div class="text-6xl md:text-7xl leading-[1.8em] font-black text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text">
                  Invalid state...how did you get here?
                </div>
              }
            >
              <Match when={!input().trim()}>
                <div class="text-6xl md:text-7xl leading-[1.8em] font-black text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text">Waiting for input...</div>
              </Match>
              <Match when={result() === null}><div class="text-6xl md:text-7xl leading-[1.8em] font-black text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text">Keep typing...</div></Match>
              <Match when={Array.isArray(result())}>
                <div class="space-y-6">
                  <div class="text-6xl md:text-7xl leading-[1.8em] font-black text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text">
                    {formatDate(result()[0])}
                  </div>
                  <div class="text-gray-400 text-3xl md:text-4xl">
                    → {formatDate(result()[1])}
                  </div>
                </div>
              </Match>
            </Switch>
          </div>
        </div>

        <Show when={history().length > 0}>
          <div class="mt-auto pt-8 border-t border-white/10">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">
                History
              </h3>
              <button
                onClick={clearHistory}
                class="text-gray-400 hover:text-white text-xs transition-colors duration-200"
              >
                Clear
              </button>
            </div>

            <div class="overflow-y-auto max-h-[33vh]">
              <div
                class="flex flex-row flex-wrap gap-4 pb-4"
              >
                <For each={history()}>
                  {(item) => {
                    return (
                      <div class="w-48 p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
                        <div class="text-sm text-gray-300 truncate mb-2 font-medium">
                          {item.input}
                        </div>
                        {item.result ? (
                          <div class="text-xs text-green-400">
                            {formatDate(item.result[0])} to<br/>{formatDate(item.result[1])}
                          </div>
                        ) : (
                          <div class="text-xs text-red-400">NULL</div>
                        )}
                      </div>
                    );
                  }}
                </For>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}
