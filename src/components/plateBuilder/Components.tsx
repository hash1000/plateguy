"use client";

import { Switch } from "@/components/ui/switch";
import { cn, formatRegistration } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
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

function ToggleRow({
  title,
  checked,
  onCheckedChange,
  onLabel,
  offLabel,
  helpText,
}: {
  title: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  onLabel: string;
  offLabel: string;
  helpText?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <label className="font-bold text-black">{title}</label>
      <div className="flex items-center gap-3">
        <Switch
          className="h-6 w-11 [&>span]:h-5 [&>span]:w-5 data-[state=checked]:[&>span]:translate-x-5"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        <span className="text-black">{checked ? onLabel : offLabel}</span>
        {helpText && (
          <span title={helpText} className="text-black/70 cursor-help">
            <HelpCircle className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  );
}

export function Start({
  plateNumber,
  setPlateNumber,
  roadLegalSpacing,
  setRoadLegalSpacing,
  iWantFrontPlate,
  setIWantFrontPlate,
  iWantBackPlate,
  setIWantBackPlate,
  rememberRegistration,
  setRememberRegistration,
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
  rememberRegistration: boolean;
  setRememberRegistration: (value: boolean) => void;
  className?: string;
  isValidPlate: boolean;
}) {
  return (
    <div className={cn("grid gap-5", className)}>
      <div className="grid gap-1.5">
        <label htmlFor="registration" className="font-bold text-black">
          Your registration
        </label>
        <input
          id="registration"
          type="text"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value.toLocaleUpperCase())}
          placeholder="EWQ32"
          className="w-full rounded-md border-2 border-black bg-white px-3 py-2.5 text-lg font-semibold uppercase tracking-wide text-black outline-none focus:ring-2 focus:ring-black/40"
        />
        {plateNumber !== "" &&
          (isValidPlate ? (
            <div className="rounded-md border-2 border-black bg-white px-3 py-2.5 text-black">
              Formatted as{" "}
              <span className="font-extrabold">
                {formatRegistration(plateNumber)}
              </span>
            </div>
          ) : (
            <div className="rounded-md border-2 border-black bg-red-100 px-3 py-2.5 text-red-700">
              Not a valid registration
            </div>
          ))}
      </div>

      <ToggleRow
        title="Character Spacing"
        checked={roadLegalSpacing}
        onCheckedChange={setRoadLegalSpacing}
        onLabel="Using road legal spacing"
        offLabel="Not using road legal spacing"
      />

      <ToggleRow
        title="Front Plate"
        checked={iWantFrontPlate}
        onCheckedChange={setIWantFrontPlate}
        onLabel="I want a front plate"
        offLabel="I don't want a front plate"
      />

      <ToggleRow
        title="Rear Plate"
        checked={iWantBackPlate}
        onCheckedChange={setIWantBackPlate}
        onLabel="I want a rear plate"
        offLabel="I don't want a rear plate"
      />

      <ToggleRow
        title="Remember Registration"
        checked={rememberRegistration}
        onCheckedChange={setRememberRegistration}
        onLabel="Registration remembered"
        offLabel="Registration not remembered"
        helpText="Save your registration on this device so it's filled in automatically next time."
      />
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

function BorderCard({
  border,
  selected,
  onClick,
}: {
  border: Border;
  selected: boolean;
  onClick: () => void;
}) {
  const hex =
    border.color !== undefined
      ? `#${border.color.toString(16).padStart(6, "0")}`
      : "transparent";
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-sm px-[2px] pb-2 pt-[2px] ${selected ? "bg-black" : "bg-white"}`}
    >
      <div className="relative flex h-[90px] items-center justify-center rounded-t-sm bg-gray-100">
        <div
          className="h-[48px] w-[85%] rounded-md bg-white shadow-sm"
          style={
            border.color !== undefined
              ? { border: `4px solid ${hex}` }
              : { border: "2px dashed #9ca3af" }
          }
        />
        {border.roadLegal === false && (
          <span className="absolute bottom-1 left-1 bg-orange-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
            Not road legal
          </span>
        )}
      </div>
      <p
        className={`px-2 py-2 ${selected ? "text-white" : "text-black"}`}
      >
        {border.name}
        <span
          className={`block text-sm ${selected ? "text-white/80" : "text-black/60"}`}
        >
          {border.price ? `+£${border.price.toFixed(2)}` : "Included"}
        </span>
      </p>
    </div>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sameAsFront, frontBorder]);

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
        <BorderCard
          border={noBorder}
          selected={frontBorder.name === noBorder.name}
          onClick={() => handleFrontBorderClick(noBorder)}
        />
        {frontStyle?.borders.map((border) => (
          <BorderCard
            key={border.name}
            border={border}
            selected={frontBorder.name === border.name}
            onClick={() => handleFrontBorderClick(border)}
          />
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
            <BorderCard
              border={noBorder}
              selected={rearBorder.name === noBorder.name}
              onClick={() => handleRearBorderClick(noBorder)}
            />
            {rearStyle.borders.map((border) => (
              <BorderCard
                key={border.name}
                border={border}
                selected={rearBorder.name === border.name}
                onClick={() => handleRearBorderClick(border)}
              />
            ))}
          </>
        )}
      </TabsContent>
    </Tabs>
  );
}
