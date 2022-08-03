import PreHeader from './components/PreHeader';
import "./App.css";
import Hero from './components/Hero';
import Team from './components/Team';
import Partners from './components/Partners';
import Contacts from './components/Contact';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import useMeta from './hooks/useMeta';
import useContract from "./hooks/useContract";



function App() {

  const {account} = useMeta(); 
  const isConnected = !!account;
  const {contract} = useContract();
  

  return (

    <>
        
      {isConnected ? <Dashboard account={account} contract={contract} /> : 

        <div className="App">
          <PreHeader />
          <Hero />
          <Team />
          <Partners />
          <Contacts />
          <Footer />
        </div>

      }    
       
        
    </>
   
  );
}

export default App;
