import { type ReactElement, useEffect } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH1,
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineClozeInput,
    InlineClozeChoice,
    InlineSpotColor,
    InlineLinkedHighlight,
    InlineFeedback,
    Cartesian2D,
    InteractionHintSequence,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { useVar, useSetVar } from "@/stores";
import {
    getVariableInfo,
    numberPropsFromDefinition,
    clozePropsFromDefinition,
    choicePropsFromDefinition,
} from "../variables";

// ═══════════════════════════════════════════════════════════════════════════════
// REACTIVE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Reactive display of diameter (always 2× radius)
 */
function ReactiveDiameter() {
    const radius = useVar("circleRadius", 2) as number;
    const diameter = (radius * 2).toFixed(2);
    return <span style={{ color: "#3b82f6", fontWeight: 600 }}>{diameter}</span>;
}

/**
 * Reactive display of circumference (π × diameter)
 */
function ReactiveCircumference() {
    const radius = useVar("circleRadius", 2) as number;
    const circumference = (Math.PI * 2 * radius).toFixed(2);
    return <span style={{ color: "#22c55e", fontWeight: 600 }}>{circumference}</span>;
}

/**
 * Reactive Pi calculation display
 */
function ReactivePiRatio() {
    return <span style={{ color: "#8b5cf6", fontWeight: 600 }}>3.14159...</span>;
}

/**
 * Interactive Circle Visualization with draggable radius point
 */
function InteractiveCircleViz() {
    const radius = useVar("circleRadius", 2) as number;
    const setVar = useSetVar();
    const highlightId = useVar("circleHighlight", "") as string;

    // Keep derived values in sync
    useEffect(() => {
        setVar("circleDiameter", radius * 2);
        setVar("circleCircumference", Math.PI * 2 * radius);
    }, [radius, setVar]);

    return (
        <div className="relative">
            <Cartesian2D
                height={380}
                viewBox={{ x: [-5, 5], y: [-5, 5] }}
                showGrid={true}
                highlightVarName="circleHighlight"
                movablePoints={[
                    {
                        initial: [radius, 0],
                        color: "#ef4444",
                        constrain: "horizontal",
                        onChange: (point) => {
                            const newRadius = Math.max(0.5, Math.min(4, Math.abs(point[0])));
                            setVar("circleRadius", Math.round(newRadius * 10) / 10);
                        },
                    },
                ]}
                dynamicPlots={([[x]]) => {
                    const r = Math.abs(x);
                    return [
                        // Circle outline
                        {
                            type: "circle" as const,
                            center: [0, 0] as [number, number],
                            radius: r,
                            color: "#64748b",
                            fillOpacity: 0.05,
                            highlightId: "circumference",
                        },
                        // Center point
                        {
                            type: "point" as const,
                            x: 0,
                            y: 0,
                            color: "#475569",
                            highlightId: "center",
                        },
                        // Radius line
                        {
                            type: "segment" as const,
                            point1: [0, 0] as [number, number],
                            point2: [r, 0] as [number, number],
                            color: "#ef4444",
                            weight: 3,
                            highlightId: "radius",
                        },
                        // Diameter line (shown lighter)
                        {
                            type: "segment" as const,
                            point1: [-r, 0] as [number, number],
                            point2: [r, 0] as [number, number],
                            color: "#3b82f6",
                            weight: 2,
                            style: "dashed" as const,
                            highlightId: "diameter",
                        },
                    ];
                }}
            />
            <InteractionHintSequence
                hintKey="circle-radius-drag"
                steps={[
                    {
                        gesture: "drag-horizontal",
                        label: "Drag the red point",
                        position: { x: "70%", y: "50%" },
                    },
                ]}
            />
        </div>
    );
}

/**
 * Pi Discovery Visualization - Shows circumference "unrolling" compared to diameter
 */
function PiDiscoveryViz() {
    const radius = useVar("circleRadius", 2) as number;
    const diameter = radius * 2;
    const circumference = Math.PI * diameter;

    return (
        <div className="relative bg-white rounded-lg p-4">
            <svg width="100%" height="200" viewBox="0 0 400 200">
                {/* Background */}
                <rect width="400" height="200" fill="white" />

                {/* Circle */}
                <circle
                    cx="70"
                    cy="100"
                    r={radius * 25}
                    fill="rgba(100, 116, 139, 0.1)"
                    stroke="#64748b"
                    strokeWidth="2"
                />

                {/* Diameter line in circle */}
                <line
                    x1={70 - radius * 25}
                    y1="100"
                    x2={70 + radius * 25}
                    y2="100"
                    stroke="#3b82f6"
                    strokeWidth="3"
                />

                {/* Diameter reference bar */}
                <rect
                    x="150"
                    y="60"
                    width={diameter * 25}
                    height="12"
                    fill="#3b82f6"
                    rx="2"
                />
                <text x="150" y="52" fontSize="12" fill="#3b82f6" fontWeight="600">
                    Diameter = {diameter.toFixed(1)}
                </text>

                {/* Circumference bar */}
                <rect
                    x="150"
                    y="120"
                    width={Math.min(circumference * 25, 240)}
                    height="12"
                    fill="#22c55e"
                    rx="2"
                />
                <text x="150" y="112" fontSize="12" fill="#22c55e" fontWeight="600">
                    Circumference = {circumference.toFixed(2)}
                </text>

                {/* Pi markers on circumference */}
                {[1, 2, 3].map((i) => (
                    <g key={i}>
                        <line
                            x1={150 + diameter * 25 * i}
                            y1="120"
                            x2={150 + diameter * 25 * i}
                            y2="140"
                            stroke="#8b5cf6"
                            strokeWidth="2"
                            strokeDasharray={i === 3 ? "4,2" : "0"}
                        />
                        <text
                            x={150 + diameter * 25 * i}
                            y="155"
                            fontSize="10"
                            fill="#8b5cf6"
                            textAnchor="middle"
                        >
                            {i}×d
                        </text>
                    </g>
                ))}

                {/* Pi label */}
                <text x="150" y="180" fontSize="14" fill="#8b5cf6" fontWeight="700">
                    The circumference fits about 3.14 diameters → That&apos;s π!
                </text>
            </svg>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION BLOCKS
// ═══════════════════════════════════════════════════════════════════════════════

export const circlesAndPiBlocks: ReactElement[] = [
    // ─────────────────────────────────────────
    // SECTION 1: Introduction - The Mystery
    // ─────────────────────────────────────────
    <StackLayout key="layout-intro-title" maxWidth="xl">
        <Block id="intro-title" padding="lg">
            <EditableH1 id="h1-intro-title" blockId="intro-title">
                Discovering Pi: The Circle&apos;s Secret Number
            </EditableH1>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-intro-hook" maxWidth="xl">
        <Block id="intro-hook" padding="sm">
            <EditableParagraph id="para-intro-hook" blockId="intro-hook">
                Every circle in the universe, from a tiny coin to a massive planet, hides the same
                mysterious number. No matter how big or small the circle, this number always appears
                when we compare how far it is around the circle to how wide it is. Mathematicians
                call this number{" "}
                <InlineSpotColor varName="spotPi" color="#8b5cf6">
                    Pi (π)
                </InlineSpotColor>
                . Let&apos;s discover where it comes from.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ─────────────────────────────────────────
    // SECTION 2: Circle Parts
    // ─────────────────────────────────────────
    <StackLayout key="layout-parts-heading" maxWidth="xl">
        <Block id="parts-heading" padding="md">
            <EditableH2 id="h2-parts-heading" blockId="parts-heading">
                The Parts of a Circle
            </EditableH2>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-parts-explorer" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="parts-radius-text" padding="sm">
                <EditableParagraph id="para-parts-radius" blockId="parts-radius-text">
                    The{" "}
                    <InlineLinkedHighlight
                        varName="circleHighlight"
                        highlightId="radius"
                        color="#ef4444"
                    >
                        radius
                    </InlineLinkedHighlight>{" "}
                    is the distance from the centre of the circle to its edge. In this circle,
                    the radius is{" "}
                    <InlineScrubbleNumber
                        varName="circleRadius"
                        {...numberPropsFromDefinition(getVariableInfo("circleRadius"))}
                    />{" "}
                    units.
                </EditableParagraph>
            </Block>
            <Block id="parts-diameter-text" padding="sm">
                <EditableParagraph id="para-parts-diameter" blockId="parts-diameter-text">
                    The{" "}
                    <InlineLinkedHighlight
                        varName="circleHighlight"
                        highlightId="diameter"
                        color="#3b82f6"
                    >
                        diameter
                    </InlineLinkedHighlight>{" "}
                    stretches all the way across the circle, passing through the centre.
                    It&apos;s always exactly twice the radius, so this circle&apos;s diameter
                    is <ReactiveDiameter /> units.
                </EditableParagraph>
            </Block>
            <Block id="parts-circumference-text" padding="sm">
                <EditableParagraph id="para-parts-circumference" blockId="parts-circumference-text">
                    The{" "}
                    <InlineLinkedHighlight
                        varName="circleHighlight"
                        highlightId="circumference"
                        color="#22c55e"
                    >
                        circumference
                    </InlineLinkedHighlight>{" "}
                    is the distance all the way around the circle. For this circle,
                    the circumference is <ReactiveCircumference /> units.
                </EditableParagraph>
            </Block>
        </div>
        <Block id="parts-visualization" padding="sm" hasVisualization>
            <InteractiveCircleViz />
        </Block>
    </SplitLayout>,

    // ─────────────────────────────────────────
    // SECTION 3: The Ratio Discovery
    // ─────────────────────────────────────────
    <StackLayout key="layout-ratio-heading" maxWidth="xl">
        <Block id="ratio-heading" padding="md">
            <EditableH2 id="h2-ratio-heading" blockId="ratio-heading">
                The Magic Ratio
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-ratio-explanation" maxWidth="xl">
        <Block id="ratio-explanation" padding="sm">
            <EditableParagraph id="para-ratio-explanation" blockId="ratio-explanation">
                Here&apos;s the remarkable thing: if you take any circle and divide its{" "}
                <InlineSpotColor varName="spotCircumference" color="#22c55e">
                    circumference
                </InlineSpotColor>{" "}
                by its{" "}
                <InlineSpotColor varName="spotDiameter" color="#3b82f6">
                    diameter
                </InlineSpotColor>
                , you always get the same number. It doesn&apos;t matter if the circle is
                tiny or enormous. The result is always approximately <ReactivePiRatio />.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-ratio-viz" maxWidth="xl">
        <Block id="ratio-visualization" padding="md" hasVisualization>
            <PiDiscoveryViz />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-ratio-formula" maxWidth="xl">
        <Block id="ratio-formula" padding="md">
            <FormulaBlock
                latex="\frac{\clr{circ}{C}}{\clr{diam}{d}} = \clr{pi}{\pi} \approx 3.14159..."
                colorMap={{
                    circ: "#22c55e",
                    diam: "#3b82f6",
                    pi: "#8b5cf6",
                }}
            />
        </Block>
    </StackLayout>,

    // ─────────────────────────────────────────
    // SECTION 4: Meet Pi
    // ─────────────────────────────────────────
    <StackLayout key="layout-pi-heading" maxWidth="xl">
        <Block id="pi-heading" padding="md">
            <EditableH2 id="h2-pi-heading" blockId="pi-heading">
                Meet Pi (π)
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-pi-explanation" maxWidth="xl">
        <Block id="pi-explanation" padding="sm">
            <EditableParagraph id="para-pi-explanation" blockId="pi-explanation">
                This special number is called{" "}
                <InlineSpotColor varName="spotPi" color="#8b5cf6">
                    Pi
                </InlineSpotColor>
                , written with the Greek letter π. Pi is an irrational number, which means
                its decimal digits go on forever without repeating. We often round it to 3.14
                for calculations, but its true value is 3.14159265358979... and the digits
                never end!
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-pi-circumference" maxWidth="xl">
        <Block id="pi-circumference-insight" padding="sm">
            <EditableParagraph id="para-pi-circumference" blockId="pi-circumference-insight">
                Because circumference divided by diameter always equals π, we can rearrange
                this to find the circumference of any circle:
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-circumference-formula" maxWidth="xl">
        <Block id="circumference-formula" padding="md">
            <FormulaBlock
                latex="\clr{circ}{C} = \clr{pi}{\pi} \times \clr{diam}{d}"
                colorMap={{
                    circ: "#22c55e",
                    pi: "#8b5cf6",
                    diam: "#3b82f6",
                }}
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-radius-formula-text" maxWidth="xl">
        <Block id="radius-formula-text" padding="sm">
            <EditableParagraph id="para-radius-formula" blockId="radius-formula-text">
                Since the diameter is twice the radius (d = 2r), we can also write:
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-circumference-radius-formula" maxWidth="xl">
        <Block id="circumference-radius-formula" padding="md">
            <FormulaBlock
                latex="\clr{circ}{C} = 2\clr{pi}{\pi}\clr{rad}{r}"
                colorMap={{
                    circ: "#22c55e",
                    pi: "#8b5cf6",
                    rad: "#ef4444",
                }}
            />
        </Block>
    </StackLayout>,

    // ─────────────────────────────────────────
    // SECTION 5: Check Your Understanding
    // ─────────────────────────────────────────
    <StackLayout key="layout-check-heading" maxWidth="xl">
        <Block id="check-heading" padding="md">
            <EditableH2 id="h2-check-heading" blockId="check-heading">
                Check Your Understanding
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-question-diameter" maxWidth="xl">
        <Block id="question-diameter" padding="sm">
            <EditableParagraph id="para-question-diameter" blockId="question-diameter">
                The diameter of a circle is always{" "}
                <InlineFeedback
                    varName="answerDiameterRelation"
                    correctValue="2"
                    position="mid"
                    successMessage="✓"
                    failureMessage="✗"
                    hint="Think about how diameter relates to radius"
                >
                    <InlineClozeInput
                        varName="answerDiameterRelation"
                        correctAnswer="2"
                        {...clozePropsFromDefinition(getVariableInfo("answerDiameterRelation"))}
                    />
                </InlineFeedback>{" "}
                times the radius.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-question-pi" maxWidth="xl">
        <Block id="question-pi" padding="sm">
            <EditableParagraph id="para-question-pi" blockId="question-pi">
                Pi (π) is approximately equal to{" "}
                <InlineFeedback
                    varName="answerPiApprox"
                    correctValue="3.14"
                    position="terminal"
                    successMessage="— exactly right! Pi is approximately 3.14159..."
                    failureMessage="— not quite."
                    hint="It starts with 3 and has a decimal part"
                >
                    <InlineClozeChoice
                        varName="answerPiApprox"
                        correctAnswer="3.14"
                        options={["2.14", "3.14", "4.14", "1.14"]}
                        {...choicePropsFromDefinition(getVariableInfo("answerPiApprox"))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-question-formula" maxWidth="xl">
        <Block id="question-formula" padding="sm">
            <EditableParagraph id="para-question-formula" blockId="question-formula">
                The formula for the circumference of a circle is C ={" "}
                <InlineFeedback
                    varName="answerCircumferenceFormula"
                    correctValue="π × d"
                    position="terminal"
                    successMessage="— well done! Circumference equals Pi times the diameter"
                    failureMessage="— try again."
                    hint="We multiply Pi by something to get the circumference"
                    reviewBlockId="ratio-formula"
                    reviewLabel="Review the formula"
                >
                    <InlineClozeChoice
                        varName="answerCircumferenceFormula"
                        correctAnswer="π × d"
                        options={["π + d", "π × d", "π ÷ d", "d ÷ π"]}
                        {...choicePropsFromDefinition(getVariableInfo("answerCircumferenceFormula"))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ─────────────────────────────────────────
    // SECTION 6: Summary
    // ─────────────────────────────────────────
    <StackLayout key="layout-summary-heading" maxWidth="xl">
        <Block id="summary-heading" padding="md">
            <EditableH2 id="h2-summary-heading" blockId="summary-heading">
                What We Discovered
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-summary-text" maxWidth="xl">
        <Block id="summary-text" padding="sm">
            <EditableParagraph id="para-summary" blockId="summary-text">
                Today we explored the relationship between a circle&apos;s{" "}
                <InlineSpotColor varName="spotCircumference" color="#22c55e">
                    circumference
                </InlineSpotColor>{" "}
                and its{" "}
                <InlineSpotColor varName="spotDiameter" color="#3b82f6">
                    diameter
                </InlineSpotColor>
                . We discovered that this ratio is always the same magical number:{" "}
                <InlineSpotColor varName="spotPi" color="#8b5cf6">
                    Pi (π) ≈ 3.14159...
                </InlineSpotColor>
                . This gives us the powerful formula C = πd, which lets us calculate the
                circumference of any circle if we know its diameter.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
