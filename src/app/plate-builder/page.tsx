"use client";

import {
  BORDER,
  SIZING,
  Start,
  STYLE,
} from "@/components/plateBuilder/Components";
import ThreeDRectangle, {
  CAMERA_ANGLES,
  PlateHandle,
} from "@/components/plateBuilder/Plate";
import PlateSummary from "@/components/plateBuilder/PlateSummary";
import { useToast } from "@/hooks/use-toast";
import { applyOverridesToCatalog } from "@/lib/pricing";
import { formatRegistration } from "@/lib/utils";
import { ArrowRight, Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Border,
  GelColors,
  getStylesByLetterCount,
  Plate,
  PlateSize,
  plateStyles,
} from "../../style/PlateStyles";

const STEPS = ["start", "style", "size", "border", "badge", "finish"] as const;
type Step = (typeof STEPS)[number];

const REMEMBER_KEY = "plateguy_saved_registration";

const DEFAULT_FRONT_SIZE: PlateSize = {
  key: "standard",
  width: 20.5,
  height: 4.5,
  price: 0,
};

export default function PlateBuilder() {
  const { toast } = useToast();

  const [activeStep, setActiveStep] = useState<Step>("start");
  const [plateNumber, setPlateNumber] = useState("");
  const [roadLegalSpacing, setRoadLegalSpacing] = useState(true);
  const [iWantFrontPlate, setIWantFrontPlate] = useState(true);
  const [iWantBackPlate, setIWantBackPlate] = useState(true);
  const [rememberRegistration, setRememberRegistration] = useState(false);
  const [frontStyle, setFrontStyle] = useState<Plate>(plateStyles[0]);
  const [rearStyle, setRearStyle] = useState<Plate>(plateStyles[0]);
  const [frontPrice, setFrontPrice] = useState(0);
  const [rearPrice, setRearPrice] = useState(0);
  const [frontGelColor, setFrontGelColor] = useState<GelColors | null>(null);
  const [rearGelColor, setRearGelColor] = useState<GelColors | null>(null);
  const sameAsFront = true;

  const [isValidPlate, setIsValidPlate] = useState(false);
  const [isRear, setIsRear] = useState(false);
  const [cameraAngle, setCameraAngle] = useState(1);
  const [pricingVersion, setPricingVersion] = useState(0);
  const plateRef = useRef<PlateHandle>(null);

  // Load admin price overrides and apply them to the catalog
  useEffect(() => {
    let cancelled = false;
    fetch("/api/pricing")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.overrides?.length) return;
        applyOverridesToCatalog(data.overrides);
        setPricingVersion((v) => v + 1);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const formattedPlate = formatRegistration(plateNumber);

  useEffect(() => {
    const pl = plateNumber.replace(/ /g, "").length;
    if (pl > 4 && pl < 8) {
      setIsValidPlate(true);
      const styles = getStylesByLetterCount(pl);
      if (styles.length > 0) {
        setFrontStyle(styles[0]);
        setRearStyle(styles[0]);
      }
    } else {
      setIsValidPlate(false);
    }
  }, [plateNumber]);

  // Load a remembered registration on first visit
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        setPlateNumber(saved);
        setRememberRegistration(true);
      }
    } catch {
      // localStorage unavailable (private mode etc.) — ignore
    }
  }, []);

  useEffect(() => {
    try {
      if (rememberRegistration && plateNumber) {
        window.localStorage.setItem(REMEMBER_KEY, plateNumber);
      } else if (!rememberRegistration) {
        window.localStorage.removeItem(REMEMBER_KEY);
      }
    } catch {
      // ignore
    }
  }, [rememberRegistration, plateNumber]);

  const [frontSize, setFrontSize] = useState<PlateSize>(DEFAULT_FRONT_SIZE);

  const [rearSize, setRearSize] = useState<PlateSize>(() => {
    const sizes = plateStyles[0]?.rearPlate?.sizes as PlateSize[] | undefined;
    if (sizes && sizes.length > 0) {
      return sizes.find((size) => size.key === "standard") || sizes[0];
    }
    return DEFAULT_FRONT_SIZE;
  });

  useEffect(() => {
    const frontSizes = frontStyle.frontPlate.sizes;
    const rearSizes: PlateSize[] = rearStyle.rearPlate.sizes;

    if (frontSizes && frontSizes.length > 0) {
      setFrontSize(
        frontSizes.find((size) => size.key === "standard") || frontSizes[0],
      );
    }

    if (rearSizes && rearSizes.length > 0) {
      setRearSize(
        rearSizes.find((size) => size.key === "standard") || rearSizes[0],
      );
    }
  }, [frontStyle, rearStyle]);

  useEffect(() => {
    setRearPrice(rearSize?.price ?? 0);
  }, [rearSize, pricingVersion]);

  useEffect(() => {
    setFrontPrice(frontSize?.price ?? 0);
  }, [frontSize, pricingVersion]);

  const [frontBorder, setFrontBorder] = useState<Border>(() => ({
    name: "None",
    material: { thickness: 0, type: "None" },
    type: "None",
  }));

  const [rearBorder, setRearBorder] = useState<Border>(() => ({
    name: "None",
    material: { thickness: 0, type: "None" },
    type: "None",
  }));

  useEffect(() => {
    if (!roadLegalSpacing) {
      toast({
        title: "Not legal",
        description: "This plate will not be road legal",
        variant: "destructive",
      });
    }
  }, [roadLegalSpacing, toast]);

  // Keep the preview on a plate the user actually wants
  useEffect(() => {
    if (!iWantFrontPlate && iWantBackPlate) setIsRear(true);
    if (!iWantBackPlate && iWantFrontPlate) setIsRear(false);
  }, [iWantFrontPlate, iWantBackPlate]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as unknown;
      if (typeof data !== "object" || !data) return;
      const plateNumber = (data as Record<string, unknown>).plateNumber;
      if (typeof plateNumber === "string") setPlateNumber(plateNumber);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const goNext = () => {
    const index = STEPS.indexOf(activeStep);
    if (index < STEPS.length - 1) setActiveStep(STEPS[index + 1]);
  };

  const stepDisabled = (step: Step) => step !== "start" && !isValidPlate;

  return (
    <div className="min-h-screen bg-[#e8e8e8] py-8 text-gray-900">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 lg:flex-row lg:items-start">
        {/* Builder (tabs + panel + preview) */}
        <div className="min-w-0 flex-1">
          {/* Step tab strip */}
          <div className="flex gap-[6px] overflow-x-auto">
            {STEPS.map((step) => (
              <button
                key={step}
                disabled={stepDisabled(step)}
                onClick={() => setActiveStep(step)}
                className={`flex-1 whitespace-nowrap border-b-4 border-[#F5C843] px-6 py-4 text-left text-lg font-extrabold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  activeStep === step
                    ? "bg-[#F5C843] text-black"
                    : "bg-[#f2f2f2] text-gray-800 hover:bg-[#eaeaea]"
                }`}
              >
                {step}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
            {/* Left options panel */}
            <div className="flex w-full flex-col gap-4 md:w-[360px] md:shrink-0">
              <div className="max-h-[600px] overflow-y-auto rounded-xl bg-[#F5C843] p-5 text-black">
                {activeStep === "start" && (
                  <Start
                    isValidPlate={isValidPlate}
                    plateNumber={plateNumber}
                    setPlateNumber={setPlateNumber}
                    roadLegalSpacing={roadLegalSpacing}
                    setRoadLegalSpacing={setRoadLegalSpacing}
                    iWantFrontPlate={iWantFrontPlate}
                    setIWantFrontPlate={setIWantFrontPlate}
                    iWantBackPlate={iWantBackPlate}
                    setIWantBackPlate={setIWantBackPlate}
                    rememberRegistration={rememberRegistration}
                    setRememberRegistration={setRememberRegistration}
                  />
                )}
                {activeStep === "style" && (
                  <STYLE
                    frontGelColor={frontGelColor}
                    setFrontGelColor={setFrontGelColor}
                    setRearGelColor={setRearGelColor}
                    rearStyle={rearStyle}
                    frontStyle={frontStyle}
                    plateNumber={plateNumber}
                    setRearStyle={setRearStyle}
                    setFrontStyle={setFrontStyle}
                    sameAsFront={sameAsFront}
                  />
                )}
                {activeStep === "size" && (
                  <SIZING
                    rearStyle={rearStyle}
                    frontStyle={frontStyle}
                    rearSize={rearSize}
                    frontSize={frontSize}
                    setRearSize={setRearSize}
                    setFrontSize={setFrontSize}
                  />
                )}
                {activeStep === "border" && (
                  <BORDER
                    rearStyle={rearStyle}
                    frontStyle={frontStyle}
                    setFrontBorder={setFrontBorder}
                    setRearBorder={setRearBorder}
                    rearBorder={rearBorder}
                    frontBorder={frontBorder}
                  />
                )}
                {activeStep === "badge" && (
                  <div className="grid gap-3">
                    <h3 className="font-bold">Badge</h3>
                    <div className="rounded-md border-2 border-black bg-white px-3 py-2.5 font-semibold">
                      No badge
                    </div>
                    <p className="text-sm text-black/70">
                      More badge options are coming soon.
                    </p>
                  </div>
                )}
                {activeStep === "finish" && (
                  <div className="grid gap-3">
                    <h3 className="font-bold">All done!</h3>
                    <p>
                      Review your plates in the summary and hit{" "}
                      <span className="font-extrabold">ADD TO BASKET</span> when
                      you&apos;re happy.
                    </p>
                  </div>
                )}
              </div>

              {activeStep !== "finish" && (
                <button
                  onClick={goNext}
                  disabled={!isValidPlate}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#F5C843] py-4 text-lg font-extrabold tracking-wide text-black transition hover:bg-[#eebd2e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  NEXT <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Preview */}
            <div className="min-w-0 flex-1">
              <div className="flex gap-[6px]">
                {iWantFrontPlate && (
                  <button
                    onClick={() => setIsRear(false)}
                    className={`flex-1 px-6 py-4 text-left transition ${
                      !isRear
                        ? "bg-[#F5C843] text-black"
                        : "bg-[#f2f2f2] text-gray-800 hover:bg-[#eaeaea]"
                    }`}
                  >
                    <span className="text-lg font-extrabold">FRONT</span>{" "}
                    <span className="text-sm font-semibold">PREVIEW</span>
                  </button>
                )}
                {iWantBackPlate && (
                  <button
                    onClick={() => setIsRear(true)}
                    className={`flex-1 px-6 py-4 text-left transition ${
                      isRear
                        ? "bg-[#F5C843] text-black"
                        : "bg-[#f2f2f2] text-gray-800 hover:bg-[#eaeaea]"
                    }`}
                  >
                    <span className="text-lg font-extrabold">REAR</span>{" "}
                    <span className="text-sm font-semibold">PREVIEW</span>
                  </button>
                )}
              </div>

              <div className="border-2 border-[#F5C843] bg-white">
                <div className="relative h-[440px] w-full">
                  {/* Camera angle strip */}
                  <div className="absolute right-0 top-0 z-10 flex items-center gap-2 rounded-bl-lg bg-[#F5C843] px-3 py-2">
                    {Object.keys(CAMERA_ANGLES).map((key) => {
                      const angle = Number(key);
                      return (
                        <button
                          key={angle}
                          title={`Camera angle ${angle}`}
                          onClick={() => setCameraAngle(angle)}
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-black/80 text-sm font-semibold text-black transition ${
                            cameraAngle === angle
                              ? "bg-white"
                              : "bg-transparent hover:bg-white/50"
                          }`}
                        >
                          {angle}
                        </button>
                      );
                    })}
                    <button
                      title="Download a snapshot of the preview"
                      onClick={() => plateRef.current?.screenshot()}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:bg-black hover:text-white"
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>
                  {isRear ? (
                    <ThreeDRectangle
                      ref={plateRef}
                      cameraAngle={cameraAngle}
                      roadLegalSpacing={roadLegalSpacing}
                      gelColor={rearGelColor}
                      border={rearBorder}
                      isRear={true}
                      size={rearSize}
                      plateNumber={formattedPlate}
                      plateStyle={rearStyle}
                    />
                  ) : (
                    <ThreeDRectangle
                      ref={plateRef}
                      cameraAngle={cameraAngle}
                      roadLegalSpacing={roadLegalSpacing}
                      gelColor={frontGelColor}
                      border={frontBorder}
                      isRear={false}
                      size={frontSize}
                      plateNumber={formattedPlate}
                      plateStyle={frontStyle}
                    />
                  )}
                </div>
                <div className="border-t border-gray-200 bg-[#f4f4f4] py-2 text-center text-sm text-gray-500">
                  Click &amp; drag to move. This is a preview only. Please refer
                  to images for real examples of plates.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plate summary */}
        <div className="w-full lg:w-[400px] lg:shrink-0">
          <PlateSummary
            plateNumber={plateNumber}
            roadLegalSpacing={roadLegalSpacing}
            wantFront={iWantFrontPlate}
            wantBack={iWantBackPlate}
            frontStyle={frontStyle}
            rearStyle={rearStyle}
            frontPrice={frontPrice}
            rearPrice={rearPrice}
            frontSize={frontSize}
            rearSize={rearSize}
            frontBorder={frontBorder}
            rearBorder={rearBorder}
            frontGel={frontGelColor}
            rearGel={rearGelColor}
          />
        </div>
      </div>
    </div>
  );
}
