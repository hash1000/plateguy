"use client";

import { Field } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Border,
  GelColors,
  getStylesByLetterCount,
  Plate,
  PlateSize,
} from "../../style/PlateStyles";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

export function Start({
  plateNumber,
  setPlateNumber,
  roadLegalSpacing,
  setRoadLegalSpacing,
  iWantFrontPlate,
  setIWantFrontPlate,
  iWantBackPlate,
  setIWantBackPlate,
  className,
  isValidPlate,
}: {
  plateNumber: string;
  setPlateNumber: (value: string) => void;
  roadLegalSpacing: boolean;
  setRoadLegalSpacing: (value: boolean) => void;
  iWantFrontPlate: boolean;
  setIWantFrontPlate: (value: boolean) => void;
  iWantBackPlate: boolean;
  setIWantBackPlate: (value: boolean) => void;
  className?: string;
  isValidPlate: boolean;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <div className={cn("", className)}>

      <Field
        label="Your registration"
        id="registration"
        value={plateNumber}
        onChange={(v: string) => setPlateNumber(v.toLocaleUpperCase())}
        placeholder="WF3 2LS"
        errors={errors}
        setErrors={setErrors}
        required
      />
      {isValidPlate ? (
        <label className="border bg-white/95 px-2 py-1 rounded-sm text-yellow-800">
          Formatted as <span className="font-bold">{plateNumber}</span>
        </label>
      ) : (
        <label className="border bg-red-400/95 px-2 py-1 rounded-sm">
          Not road legal
        </label>
      )}

      <div className="grid gap-1">
        <label className="font-semibold">Character Spacing</label>
        <div className="flex items-center gap-2">
          <Switch
            checked={roadLegalSpacing}
            onCheckedChange={(value: boolean) => setRoadLegalSpacing(value)}
          />
          <label>Use road legal spacing</label>
        </div>
      </div>

      <div className="grid gap-1">
        <label className="font-semibold">Front Plate</label>
        <div className="flex items-center gap-2">
          <Switch
            checked={iWantFrontPlate}
            onCheckedChange={(value: boolean) => setIWantFrontPlate(value)}
          />
          <label>I want front plate</label>
        </div>
      </div>
      <div className="grid gap-1">
        <label className="font-semibold">Back Plate</label>
        <div className="flex items-center gap-2">
          <Switch
            checked={iWantBackPlate}
            onCheckedChange={(value: boolean) => setIWantBackPlate(value)}
          />
          <label>I want back plate</label>
        </div>
      </div>
    </div>
  );
}

interface STYLEProps {
  className?: string;
  frontStyle: Plate;
  rearStyle: Plate;
  plateNumber: string;
  frontGelColor: GelColors | null;
  setFrontGelColor: React.Dispatch<React.SetStateAction<GelColors | null>>;
  setRearGelColor: React.Dispatch<React.SetStateAction<GelColors | null>>;
  setFrontStyle: (style: Plate) => void;
  setRearStyle: (style: Plate) => void;
  sameAsFront: boolean;
}

export function STYLE({
  className,
  frontStyle,
  rearStyle,
  plateNumber,
  setFrontStyle,
  setRearStyle,
  setRearGelColor,
  frontGelColor,
  setFrontGelColor,
  sameAsFront,
}: STYLEProps) {
  const [plateStyles, setPlateSetyles] = useState<Plate[]>(
    getStylesByLetterCount(7),
  );

  useEffect(() => {
    const styles = getStylesByLetterCount(plateNumber.replace(/ /g, "").length);
    setPlateSetyles(styles);
  }, [plateNumber]);

  useEffect(() => {
    if (sameAsFront) {
      setRearStyle(frontStyle);
      setRearGelColor(frontGelColor);
    }
  }, [frontGelColor, sameAsFront]);

  const handleFrontStyleClick = (style: Plate) => {
    setFrontStyle(style);
    if (style.name.includes("Neon")) {
      toast({
        title: "Not legal",
        description: "This plate will not be road legal",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (frontStyle.gelColors) {
      setFrontGelColor(frontStyle.gelColors[0]);
    } else {
      setFrontGelColor(null);
    }
    if (sameAsFront) {
      setRearStyle(frontStyle);
      setRearGelColor(frontGelColor);
    }
  }, [frontStyle]);

  useEffect(() => {
    if (rearStyle.gelColors) {
      setRearGelColor(rearStyle.gelColors[0]);
    } else {
      setRearGelColor(null);
    }
  }, [rearStyle]);

  return (
    <Tabs
      defaultValue="front"
      className={`flex flex-col overflow-y-scroll items-stretch bg-yellow rounded-sm h-full ${className}`}
    >
      <TabsList className="grid grid-cols-2 gap-2">
        <TabsTrigger className="text-lg" value="front">
          STYLE
        </TabsTrigger>
      </TabsList>

      {/* Front Style Tab */}
      <TabsContent
        value="front"
        className="flex flex-col gap-3 col-span-2 px-2 rounded-sm"
      >
        {plateStyles.map((p: Plate, index) => {
          if (p.frontPlate.sizes.length > 1) {
            return (
              <div
                className={`pb-2 rounded-sm pt-[2px] px-[2px] ${frontStyle.name === p.name ? "bg-black text-white" : "bg-yellow"}`}
                key={index}
                onClick={() => handleFrontStyleClick(p)}
              >
                <div className="relative h-[140px]">
                  <Image
                    src={p.frontImage ? p.frontImage : "/178348.jpg"}
                    alt="img"
                    className="rounded-t-sm"
                    fill
                    priority
                  />
                </div>
                <p className="h-[60px] px-2 py-2 bg-yellow-dark">
                  {p.gelColors && p.gelColors.length === 1
                    ? p.name + " " + p.gelColors[0].name
                    : p.name}
                </p>
                {p.gelColors && p.gelColors.length > 1 && (
                  <div className="px-2 flex flex-wrap gap-2">
                    {p.gelColors &&
                      p.gelColors.map((color) => (
                        <Button
                          onClick={() => setFrontGelColor(color)}
                          className={`text-black bg-white p-1 ${frontGelColor === color ? "bg-yellow border-black text-white" : "bg-white text-black border-2 border-gray-300"}`}
                          style={{
                            color: `#${color[index === 0 ? "top" : "botton"].toString(16).padStart(6, "0")}`,
                            backgroundColor: "yellow"
                          }}
                          key={color.name}
                        >
                          {color.name.split(" on ").map((word, index) => (
                            <span
                              key={index}
                            >
                              {word} {index === 0 ? "on " : ""}
                            </span>
                          ))}
                        </Button>
                      ))}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </TabsContent>
    </Tabs>
  );
}

interface SizingProps {
  className?: string;
  frontSize: PlateSize;
  rearSize: PlateSize;
  frontStyle: Plate;
  rearStyle: Plate;
  setFrontSize: (style: PlateSize) => void;
  setRearSize: (style: PlateSize) => void;
}

export function SIZING({ className, frontSize, rearSize, frontStyle, rearStyle, setFrontSize, setRearSize }: SizingProps) {
  const [sameAsFront, setSameAsFront] = useState(true);

  useEffect(() => {
    if (sameAsFront) {
      setRearSize(frontSize)
    }
  }, [sameAsFront])

  const handleFrontSizeClick = (style: PlateSize) => {
    setFrontSize(style); // This will update the state in the parent component

  };

  useEffect(() => {
    if (sameAsFront) {
      setRearSize(frontSize)
    }
  }, [frontSize])

  const handleRearSizeClick = (style: PlateSize) => {
    setRearSize(style); // This will update the state in the parent component
  };

  return (
    <Tabs defaultValue="front" className={`flex flex-col overflow-y-scroll items-stretch bg-yellow rounded-sm h-full ${className}`}>
      <TabsList className="grid grid-cols-2 gap-2">
        <TabsTrigger className="text-lg" value="front">
          FRONT <span className="ml-2 font-extralight mt-2 text-base">STYLE</span>
        </TabsTrigger>
        <TabsTrigger className="text-lg" value="back">
          BACK <span className="ml-2 font-extralight mt-2 text-base">STYLE</span>
        </TabsTrigger>
      </TabsList>

      {/* Front Style Tab */}
      <TabsContent value="front" className="flex flex-col gap-3 col-span-2 px-2 rounded-sm">
        <div
          className={` pb-2 rounded-sm  pt-[2px] px-[2px]`}
        >
          <div className=" relative h-[140px]"><Image src={"/178348.jpg"} alt="img" className=" rounded-t-sm" fill priority /></div>
          <p className="px-2 py-2">{frontStyle.name}</p>
          <div className="px-2 flex flex-wrap gap-1">
            {
              frontStyle.frontPlate.sizes.map((size: PlateSize) => (
                <Button onClick={() => handleFrontSizeClick(size)} className={`bg-white p-1  border-2 ${frontSize.key == size.key ? "border-black " : ""}`} key={size.key}>{size.key + "-" + size.width + "x" + size.height}</Button>
              ))
            }
          </div>
        </div>
      </TabsContent>

      {/* Rear Style Tab */}
      <TabsContent value="back" className="flex flex-col gap-3 col-span-2 h-[390px] px-2 rounded-sm">
        <div className="mt-2">
          <Switch className="mr-3" checked={sameAsFront} onCheckedChange={(e) => setSameAsFront(e)} />
          <label>Same as front</label>
        </div>

        {/* Conditionally render rear style options based on sameAsFront */}
        {!sameAsFront && (
          <div
            className={` pb-2 rounded-sm  pt-[2px] px-[2px]`}
          >
            <div className=" relative h-[140px]"><Image src={"/178348.jpg"} alt="img" className=" rounded-t-sm" fill priority /></div>
            <p className="px-2 py-2">{rearStyle.name}</p>
            <div className="px-2 flex flex-wrap gap-1">
              {
                rearStyle.rearPlate.sizes.map((size: PlateSize) => (
                  <Button onClick={() => handleRearSizeClick(size)} className={`bg-white p-1  border-2 ${rearSize.key == size.key ? "border-black " : ""}`} key={size.key}>{size.key + "-" + size.width + "x" + size.height}</Button>
                ))
              }
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

interface BorderProps {
  className?: string;
  frontStyle: Plate;
  rearStyle: Plate;
  frontBorder: Border;
  rearBorder: Border;
  setFrontBorder: (style: Border) => void;
  setRearBorder: (style: Border) => void;
}

export function BORDER({
  className,
  frontBorder,
  rearBorder,
  frontStyle,
  rearStyle,
  setFrontBorder,
  setRearBorder,
}: BorderProps) {
  const [sameAsFront, setSameAsFront] = useState(true);
  const noBorder: Border = {
    name: "None",
    material: { thickness: 0, type: "None" },
    type: "None",
  };

  useEffect(() => {
    if (sameAsFront) {
      setRearBorder(frontBorder);
    }
  }, [sameAsFront]);

  const handleFrontBorderClick = (style: Border) => {
    setFrontBorder(style); // This will update the state in the parent component
  };

  const handleRearBorderClick = (style: Border) => {
    setRearBorder(style); // This will update the state in the parent component
  };

  return (
    <Tabs
      defaultValue="front"
      className={`flex flex-col overflow-y-scroll items-stretch bg-yellow rounded-sm h-full ${className}`}
    >
      <TabsList className="grid grid-cols-2 gap-2">
        <TabsTrigger className="text-lg" value="front">
          FRONT{" "}
          <span className="ml-2 font-extralight mt-2 text-base">STYLE</span>
        </TabsTrigger>
        <TabsTrigger className="text-lg" value="back">
          BACK{" "}
          <span className="ml-2 font-extralight mt-2 text-base">STYLE</span>
        </TabsTrigger>
      </TabsList>

      {/* Front Style Tab */}
      <TabsContent
        value="front"
        className="flex flex-col gap-3 col-span-2 px-2 rounded-sm"
      >
        <div
          onClick={() => handleFrontBorderClick(noBorder)}
          className={`pb-2 rounded-sm pt-[2px] px-[2px] ${frontBorder.name === noBorder.name ? "bg-black" : "bg-white"}`}
        >
          <div className="relative h-[140px]">
            <Image
              src={"/178348.jpg"}
              alt="img"
              className="rounded-t-sm"
              fill
              priority
            />
          </div>
          <p
            className={`px-2 py-2 ${frontBorder.name === noBorder.name ? "text-white" : "text-black"}`}
          >
            No border
          </p>
        </div>
        {frontStyle?.borders.map((border) => (
          <div
            onClick={() => handleFrontBorderClick(border)}
            className={`pb-2 rounded-sm pt-[2px] px-[2px] ${frontBorder.name === border.name ? "bg-black" : "bg-white"}`}
            key={border.name}
          >
            <div className="relative h-[140px]">
              <Image
                src={"/178348.jpg"}
                alt="img"
                className="rounded-t-sm"
                fill
                priority
              />
            </div>
            <p
              className={`px-2 py-2 ${frontBorder.name === border.name ? "text-white" : "text-black"}`}
            >
              {border.name}
            </p>
          </div>
        ))}
      </TabsContent>

      {/* Rear Style Tab */}
      <TabsContent
        value="back"
        className="flex flex-col gap-3 col-span-2 h-[390px] px-2 rounded-sm"
      >
        <div className="mt-2">
          <Switch
            className="mr-3"
            checked={sameAsFront}
            onCheckedChange={(e: boolean) => setSameAsFront(e)}
          />
          <label>Same as front</label>
        </div>

        {/* Conditionally render rear style options based on sameAsFront */}
        {!sameAsFront && (
          <>
            <div
              onClick={() => handleRearBorderClick(noBorder)}
              className={`pb-2 rounded-sm pt-[2px] px-[2px] ${rearBorder.name === noBorder.name ? "bg-black" : "bg-white"}`}
            >
              <div className="relative h-[140px]">
                <Image
                  src={"/178348.jpg"}
                  alt="img"
                  className="rounded-t-sm"
                  fill
                  priority
                />
              </div>
              <p className="px-2 py-2">None Border</p>
            </div>
            {rearStyle.borders.map((border) => (
              <div
                onClick={() => handleRearBorderClick(border)}
                className={`pb-2 rounded-sm pt-[2px] px-[2px] ${rearBorder.name === border.name ? "bg-black" : "bg-white"}`}
                key={border.name}
              >
                <div className="relative h-[140px]">
                  <Image
                    src={"/178348.jpg"}
                    alt="img"
                    className="rounded-t-sm"
                    fill
                    priority
                  />
                </div>
                <p className="px-2 py-2">{border.name}</p>
              </div>
            ))}
          </>
        )}
      </TabsContent>
    </Tabs>
  );
}
