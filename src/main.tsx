
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Wrap in a try-catch to prevent app crashes
try {
  createRoot(document.getElementById("root")!).render(<App />);
} catch (error) {
  console.error("Failed to render the app:", error);
  
  // Create a fallback error UI
  const errorContainer = document.createElement('div');
  errorContainer.style.padding = '20px';
  errorContainer.style.margin = '20px';
  errorContainer.style.backgroundColor = '#fff1f0';
  errorContainer.style.border = '1px solid #ffccc7';
  errorContainer.style.borderRadius = '4px';
  
  const errorHeading = document.createElement('h2');
  errorHeading.textContent = 'Application Error';
  errorHeading.style.color = '#cf1322';
  errorHeading.style.marginTop = '0';
  
  const errorMessage = document.createElement('p');
  errorMessage.textContent = 'The application failed to load. Please refresh the page or try again later.';
  
  const refreshButton = document.createElement('button');
  refreshButton.textContent = 'Refresh Page';
  refreshButton.style.padding = '8px 16px';
  refreshButton.style.backgroundColor = '#1890ff';
  refreshButton.style.color = 'white';
  refreshButton.style.border = 'none';
  refreshButton.style.borderRadius = '4px';
  refreshButton.style.cursor = 'pointer';
  refreshButton.onclick = () => window.location.reload();
  
  errorContainer.appendChild(errorHeading);
  errorContainer.appendChild(errorMessage);
  errorContainer.appendChild(refreshButton);
  
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = '';
    rootElement.appendChild(errorContainer);
  }
}
