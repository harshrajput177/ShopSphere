import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ Import BrowserRouter
import { Provider } from "react-redux";
import { store } from "./Component/Store/store.js";
import './index.css';
import App from './App.jsx';
import { CartProvider } from "./Component/Cart/CartContext.jsx";
import { WishlistProvider } from "./Component/Wishlist/WishlistContext.jsx";


createRoot(document.getElementById('root')).render(
    <BrowserRouter> {/* ✅ Wrap your whole app in BrowserRouter */}

        <Provider store={store}>
            
            <CartProvider>
                <WishlistProvider>
                <App />
                </WishlistProvider>
            </CartProvider>
           
        </Provider>
    </BrowserRouter>

);
