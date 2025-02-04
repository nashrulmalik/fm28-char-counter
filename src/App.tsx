import Logo from '/logo-light-theme.svg'
import LogoDark from '/logo-dark-theme.svg'
import moonIcon from '/icon-moon.svg'
import sunIcon from '/icon-sun.svg'
import { useTheme } from './context/ThemeContext'
import { useState, useEffect } from 'react'
import { analyzeText } from './utils/textAnalyzer'

function App() {
  const [text, setText] = useState('');
  const [excludeSpaces, setExcludeSpaces] = useState(false);
  const [characterLimit, setCharacterLimit] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState(analyzeText(''));
  const [showAllLetters, setShowAllLetters] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const visibleLetters = Object.entries(analysis.letterDensity)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, showAllLetters ? undefined : 5);

  useEffect(() => {
    setAnalysis(analyzeText(text, excludeSpaces));
  }, [text, excludeSpaces]);

  const isOverLimit = characterLimit !== null && analysis.characterCount > characterLimit;
  return (
    <main className="text-foreground flex flex-col gap-12">
      <header className="flex justify-between items-center">
        <img src={theme === 'light' ? Logo : LogoDark} alt="app logo" className="h-8" />
        <button
          onClick={toggleTheme}
          className='cursor-pointer rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 w-11 h-11 flex items-center justify-center'
        >
          <img src={theme === 'light' ? moonIcon : sunIcon} alt="theme toggle" />
        </button>
      </header>
      <section>
        <div className='flex justify-center'>
          <h1 className='font-bold text-4xl md:text-6xl w-[510px]'>Analyze your text in real-time.</h1>
        </div>
      </section>
      <section className='flex flex-col gap-4'>
        <textarea
          className={`w-full h-40 p-4 rounded-lg bg-white dark:bg-neutral-800 border-2 focus:outline-none focus:ring-2 ${isOverLimit
              ? 'border-orange-500 focus:ring-orange-500'
              : 'border-neutral-200 dark:border-neutral-700 focus:ring-purple-500'
            }`}
          name="" id="" value={text} onChange={(e) => setText(e.target.value)}
          placeholder='Start typing here… (or paste your text)'
        />
        {isOverLimit && (
          <p className="text-orange-500 text-left">
            Character limit exceeded!
          </p>
        )}

        <div className='flex flex-col md:flex-row justify-between md:items-center md:h-[29px] gap-3'>
          <div className='flex flex-col md:flex-row gap-3 md:gap-6'><label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={excludeSpaces}
              onChange={(e) => setExcludeSpaces(e.target.checked)}
              className="form-checkbox text-purple-500 border-neutral-300 dark:border-neutral-700 focus:ring-purple-500 focus:ring-offset-white dark:focus:ring-offset-neutral-900"
            />
            <span>Exclude Spaces</span>
          </label>
            <div className='flex gap-[10px]'>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={characterLimit !== null}
                  onChange={(e) => setCharacterLimit(e.target.checked ? 300 : null)}
                  className="form-checkbox text-purple-500 border-neutral-300 dark:border-neutral-700 focus:ring-purple-500 focus:ring-offset-white dark:focus:ring-offset-neutral-900"
                />
                <span className="text-lg">Set Character Limit</span>
              </label>
              {characterLimit !== null && (
                <input
                  type="number"
                  value={characterLimit}
                  onChange={(e) => setCharacterLimit(Number(e.target.value))}
                  className="w-24 px-3 py-1 h-[29px] rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-700 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                />
              )}
            </div>
          </div>

          <p className="text-left md:text-right text-sm opacity-70">
            Approx. reading time: {analysis.readingTime}
          </p>
        </div>

      </section>
      <section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-neutral-900">
          <div className="flex items-start justify-center flex-col bg-purple-500 p-4 rounded-lg h-[130px] md:h-[150px] bg-[url('/pattern-character-count.svg')] bg-no-repeat bg-[bottom_right_-30px]">
            <p className="text-4xl sm:text-6xl font-bold">{analysis.characterCount}</p>
            <h3 className="text-sm opacity-80">Total Characters</h3>
          </div>
          <div className="flex items-start justify-center flex-col bg-yellow-500 p-4 rounded-lg h-[130px] md:h-[150px] bg-[url('/pattern-word-count.svg')] bg-no-repeat bg-[bottom_right_-30px]">
            <p className="text-4xl sm:text-6xl font-bold">{analysis.wordCount}</p>
            <h3 className="text-sm opacity-80">Word Count</h3>
          </div>
          <div className="flex items-start justify-center flex-col bg-orange-500 p-4 rounded-lg h-[130px] md:h-[150px] bg-[url('/pattern-sentence-count.svg')] bg-no-repeat bg-[bottom_right_-30px]">
            <p className="text-4xl sm:text-6xl font-bold">{analysis.sentenceCount}</p>
            <h3 className="text-sm opacity-80">Sentence Count</h3>
          </div>
        </div>


      </section>
      <section className="">
        <h3 className="text-xl font-bold mb-4 text-left">Letter Density</h3>
        <div className="space-y-2">
          {visibleLetters.map(([letter, data]) => (
            <div key={letter} className="flex items-center gap-4">
              <span className="w-4 text-left uppercase font-medium">{letter}</span>
              <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full">
                <div
                  className="bg-purple-500 h-2 transition-all duration-200 rounded-full"
                  style={{ width: `${data.percentage}%` }}
                />
              </div>
              <span className="w-24 text-right text-sm text-neutral-600 dark:text-neutral-400 rounded">
                {data.count} ({data.percentage.toFixed(2)}%)
              </span>
            </div>
          ))}
        </div>
        {Object.keys(analysis.letterDensity).length === 0 && (
          <p className='text-left text-neutral-600 dark:text-neutral-200 font-'>No characters found. Start typing to see letter density.</p>
        )}
        {Object.keys(analysis.letterDensity).length > 5 && (
          <button
            className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            onClick={() => setShowAllLetters(!showAllLetters)}
          >
            See {showAllLetters ? 'less ↑' : 'more ↓'}
          </button>
        )}
      </section>
    </main>
  )
}

export default App
