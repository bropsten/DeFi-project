import PreHeader from './components/PreHeader';
import "./App.css";
import Hero from './components/Hero';
import Team from './components/Team';
import Partners from './components/Partners';
import Contacts from './components/Contact';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import useWeb3 from './hooks/useWeb3';



function App() {

  const {account, web3} = useWeb3(); 
  const isConnected = !!account;
  console.log(account);

  console.log(web3);
  


  return (

    <>
        
        {isConnected ? <Dashboard account={account} /> : 

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
