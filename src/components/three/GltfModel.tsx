import { Component, Suspense, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";

interface GltfSceneProps {
  url: string;
}

function GltfScene({ url }: GltfSceneProps) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

interface BoundaryState {
  hasError: boolean;
}

class GltfErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

interface GltfModelProps {
  url: string;
  fallback: ReactNode;
}

export function GltfModel({ url, fallback }: GltfModelProps) {
  return (
    <GltfErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GltfScene url={url} />
      </Suspense>
    </GltfErrorBoundary>
  );
}
