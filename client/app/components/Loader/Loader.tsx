import "./Loader.css";


const Loader = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-white dark:bg-gray-950">
      <div className="loader"></div>

      <h2 className="font-josefin text-2xl font-bold text-slate-800 dark:text-white">
        eLearnSpace
      </h2>

      <p className="font-poppins text-sm text-slate-500 dark:text-slate-400">
        Preparing your learning experience...
      </p>
    </div>
  );
};

export default Loader