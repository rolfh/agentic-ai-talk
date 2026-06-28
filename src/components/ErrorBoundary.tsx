import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error inside Canvas/App:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-white p-6 text-center font-sans">
          <div className="max-w-md p-6 bg-red-950/20 rounded-xl border border-red-500/20 shadow-2xl backdrop-blur-md">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Noe gikk galt under innlasting av scenen</h2>
            <p className="text-sm text-gray-300 mb-4">
              Klarte ikke å laste 3D-modeller eller miljøressurser. Vennligst sjekk nettverkstilkoblingen din og prøv på nytt.
            </p>
            <pre className="text-xs bg-black/50 p-3 rounded text-left overflow-x-auto text-red-300 font-mono max-h-40">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 active:bg-red-700 transition-colors text-white font-medium rounded-lg text-sm cursor-pointer"
            >
              Last inn på nytt
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
