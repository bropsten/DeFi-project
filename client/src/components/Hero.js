import HeroPics from "../images/on_chain.png"
import useMeta from '../hooks/useMeta'


export default function Hero() {

  const {connectToMetaMask} = useMeta();

  return (
      
      <main className="lg:relative">
        <div className="mx-auto max-w-7xl w-full pt-16 pb-20 text-center lg:py-48 lg:text-left">
          <div className="px-4 lg:w-1/2 sm:px-8 xl:pr-16">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block xl:inline">Chill and Earn</span><br></br>
              <span className="block text-indigo-600 xl:inline">With Alyr-App</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
             The best Defi App you can find in the Alyra Blockchain school

            </p>
            <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <button
                type="button"
                onClick={connectToMetaMask}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Launch App
                </button>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a
                href="https://www.youtube.com/watch?v=xvFZjo5PgG0" target="_blank"
                rel="noreferrer"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Pink Paper
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="items-baseline flex max-w-xl lg:absolute lg:inset-y-10 lg:right-10 lg:w-1/2 lg:h-4/5">
          <img
            className=" inset-0 object contain"
            src={HeroPics}
            alt=""
          />
        </div>
      </main>

  )
}
