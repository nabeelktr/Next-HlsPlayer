"use client"
import * as React from "react";
import { APITypes, PlyrProps, usePlyr } from "plyr-react";
import "plyr-react/plyr.css";
import Hls from "hls.js";
import { Options } from "plyr";

const videoOptions = null;
const videoSource = null;
const hlsSource = "https://eduwise.s3.ap-south-1.amazonaws.com/hls/sample_mp4_master.m3u8";
// const hlsSource = "https://eduwise.s3.ap-south-1.amazonaws.com/mp4/sample.mp4";



const useHls = (src: string, options: Options | null) => {
  const hls = React.useRef<Hls>(new Hls());
  const hasQuality = React.useRef<boolean>(false);
  const [plyrOptions, setPlyrOptions] = React.useState<Options | null>(options);

  React.useEffect(() => {
    hasQuality.current = false;
  }, [options]);

  React.useEffect(() => {
    hls.current.loadSource(src);
    hls.current.attachMedia(document.querySelector(".plyr-react")!);
    hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
      if (hasQuality.current) return; 
      const levels = hls.current.levels;
      const quality: Options["quality"] = {
        default: levels[levels.length - 1].height,
        options: levels.map((level) => level.height),
        forced: true,
        onChange: (newQuality: number) => {
          console.log("changes", newQuality);
          levels.forEach((level, levelIndex) => {
            if (level.height === newQuality) {
              hls.current.currentLevel = levelIndex;
            }
          });
        },
      };
      setPlyrOptions({ ...plyrOptions, quality });
      hasQuality.current = true;
    });
  });

  return { options: plyrOptions };
};


const CustomPlyrInstance = React.forwardRef<
  APITypes,
  PlyrProps & { hlsSource: string }
>((props, ref) => {
  const { source, options = null, hlsSource } = props;
  const raptorRef = usePlyr(ref, {
    ...useHls(hlsSource, options),
    source,
  }) as React.MutableRefObject<HTMLVideoElement>;
  return <video ref={raptorRef} className="plyr-react plyr" />;
});


const PlyrComponent = () => {
  const ref = React.useRef<APITypes>(null);
  const supported = Hls.isSupported();

  return (
    <div className="wrapper">
      {supported ? (

        <CustomPlyrInstance
          ref={ref}
          source={videoSource}
          options={videoOptions}
          hlsSource={hlsSource}
        />
      ) : (
        "HLS is not supported in your browser"
      )}
    </div>
  );
};

export default PlyrComponent;
