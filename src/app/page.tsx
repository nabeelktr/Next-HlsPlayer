import PlyrComponent from '@/component/HLSplyr';


export default function Home() {
  const videoJsOptions = {
    sources: [
      {
        src: "//vjs.zencdn.net/v/oceans.mp4",
        type: "video/mp4"
      }
    ]
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <VideoJS options={videoJsOptions} /> */}
      <PlyrComponent />
    </main>
  );
}
