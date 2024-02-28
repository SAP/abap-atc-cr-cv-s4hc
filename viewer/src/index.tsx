import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom/client';
import parse from '@ui5/webcomponents-base/dist/PropertiesFileFormat.js';
import React from 'react';
import App from './App';

import { registerI18nLoader } from '@ui5/webcomponents-base/dist/asset-registries/i18n.js';
import { ThemeProvider } from '@ui5/webcomponents-react';
import { BrowserRouter } from 'react-router-dom';
import { AtcProvider } from './providers/AtcProvider';

import classes from "./index.module.css";

import "@ui5/webcomponents-fiori/dist/illustrations/AllIllustrations.js";
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import '@ui5/webcomponents-react/dist/Assets';

export const BundleID = "CLOUDIFICATION_REPOSITORY";

registerI18nLoader(BundleID, "en", async (localeId) => {
    const props = await (await fetch(`${process.env.PUBLIC_URL}/translations/messagebundle_${localeId}.properties`)).text();
    return parse(props);
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <div className={classes.appShell}>
                    <AtcProvider>
                        <App />
                    </AtcProvider>
                </div>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
