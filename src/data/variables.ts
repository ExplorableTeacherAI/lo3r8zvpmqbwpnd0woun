/**
 * Variables Configuration
 * =======================
 *
 * CENTRAL PLACE TO DEFINE ALL SHARED VARIABLES
 *
 * This file defines all variables that can be shared across sections.
 * AI agents should read this file to understand what variables are available.
 *
 * USAGE:
 * 1. Define variables here with their default values and metadata
 * 2. Use them in any section with: const x = useVar('variableName', defaultValue)
 * 3. Update them with: setVar('variableName', newValue)
 */

import { type VarValue } from '@/stores';

/**
 * Variable definition with metadata
 */
export interface VariableDefinition {
    /** Default value */
    defaultValue: VarValue;
    /** Human-readable label */
    label?: string;
    /** Description for AI agents */
    description?: string;
    /** Variable type hint */
    type?: 'number' | 'text' | 'boolean' | 'select' | 'array' | 'object' | 'spotColor' | 'linkedHighlight';
    /** Unit (e.g., 'Hz', '°', 'm/s') - for numbers */
    unit?: string;
    /** Minimum value (for number sliders) */
    min?: number;
    /** Maximum value (for number sliders) */
    max?: number;
    /** Step increment (for number sliders) */
    step?: number;
    /** Display color for InlineScrubbleNumber / InlineSpotColor (e.g. '#D81B60') */
    color?: string;
    /** Options for 'select' type variables */
    options?: string[];
    /** Placeholder text for text inputs */
    placeholder?: string;
    /** Correct answer for cloze input validation */
    correctAnswer?: string;
    /** Whether cloze matching is case sensitive */
    caseSensitive?: boolean;
    /** Background color for inline components */
    bgColor?: string;
    /** Schema hint for object types (for AI agents) */
    schema?: string;
}

/**
 * =====================================================
 * 🎯 CIRCLES AND PI LESSON VARIABLES
 * =====================================================
 */
export const variableDefinitions: Record<string, VariableDefinition> = {
    // ─────────────────────────────────────────
    // CIRCLE EXPLORATION - Interactive Radius
    // ─────────────────────────────────────────
    circleRadius: {
        defaultValue: 2,
        type: 'number',
        label: 'Circle Radius',
        description: 'The radius of the circle being explored',
        min: 0.5,
        max: 4,
        step: 0.1,
        color: '#ef4444',
    },

    // ─────────────────────────────────────────
    // DIAMETER - Derived from radius
    // ─────────────────────────────────────────
    circleDiameter: {
        defaultValue: 4,
        type: 'number',
        label: 'Circle Diameter',
        description: 'The diameter of the circle (2 × radius)',
        min: 1,
        max: 8,
        step: 0.2,
        color: '#3b82f6',
    },

    // ─────────────────────────────────────────
    // CIRCUMFERENCE - Calculated value
    // ─────────────────────────────────────────
    circleCircumference: {
        defaultValue: 12.57,
        type: 'number',
        label: 'Circumference',
        description: 'The circumference of the circle (π × diameter)',
        min: 0,
        max: 30,
        step: 0.01,
        color: '#22c55e',
    },

    // ─────────────────────────────────────────
    // PI RATIO - The discovered constant
    // ─────────────────────────────────────────
    piRatio: {
        defaultValue: 3.14159,
        type: 'number',
        label: 'Pi Ratio',
        description: 'Circumference ÷ Diameter = π',
        min: 0,
        max: 5,
        step: 0.00001,
        color: '#8b5cf6',
    },

    // ─────────────────────────────────────────
    // LINKED HIGHLIGHTS
    // ─────────────────────────────────────────
    circleHighlight: {
        defaultValue: '',
        type: 'linkedHighlight',
        label: 'Circle Highlight',
        description: 'Active highlight for circle parts',
        color: '#3b82f6',
    },

    // ─────────────────────────────────────────
    // SPOT COLORS for prose-to-visual linking
    // ─────────────────────────────────────────
    spotRadius: {
        defaultValue: 'radius',
        type: 'spotColor',
        label: 'Radius Color',
        description: 'Color for radius in prose and visuals',
        color: '#ef4444',
    },
    spotDiameter: {
        defaultValue: 'diameter',
        type: 'spotColor',
        label: 'Diameter Color',
        description: 'Color for diameter in prose and visuals',
        color: '#3b82f6',
    },
    spotCircumference: {
        defaultValue: 'circumference',
        type: 'spotColor',
        label: 'Circumference Color',
        description: 'Color for circumference in prose and visuals',
        color: '#22c55e',
    },
    spotPi: {
        defaultValue: 'pi',
        type: 'spotColor',
        label: 'Pi Color',
        description: 'Color for pi in prose and visuals',
        color: '#8b5cf6',
    },

    // ─────────────────────────────────────────
    // ASSESSMENT QUESTIONS
    // ─────────────────────────────────────────
    answerDiameterRelation: {
        defaultValue: '',
        type: 'text',
        label: 'Diameter Relation Answer',
        description: 'How many times does the radius fit in the diameter?',
        placeholder: '?',
        correctAnswer: '2',
        color: '#3b82f6',
    },
    answerPiApprox: {
        defaultValue: '',
        type: 'select',
        label: 'Pi Approximation Answer',
        description: 'What is Pi approximately equal to?',
        placeholder: '???',
        correctAnswer: '3.14',
        options: ['2.14', '3.14', '4.14', '1.14'],
        color: '#8b5cf6',
    },
    answerCircumferenceFormula: {
        defaultValue: '',
        type: 'select',
        label: 'Circumference Formula Answer',
        description: 'The formula for circumference',
        placeholder: '???',
        correctAnswer: 'π × d',
        options: ['π + d', 'π × d', 'π ÷ d', 'd ÷ π'],
        color: '#22c55e',
    },
};

/**
 * Get all variable names (for AI agents to discover)
 */
export const getVariableNames = (): string[] => {
    return Object.keys(variableDefinitions);
};

/**
 * Get a variable's default value
 */
export const getDefaultValue = (name: string): VarValue => {
    return variableDefinitions[name]?.defaultValue ?? 0;
};

/**
 * Get a variable's metadata
 */
export const getVariableInfo = (name: string): VariableDefinition | undefined => {
    return variableDefinitions[name];
};

/**
 * Get all default values as a record (for initialization)
 */
export const getDefaultValues = (): Record<string, VarValue> => {
    const defaults: Record<string, VarValue> = {};
    for (const [name, def] of Object.entries(variableDefinitions)) {
        defaults[name] = def.defaultValue;
    }
    return defaults;
};

/**
 * Get number props for InlineScrubbleNumber from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
export function numberPropsFromDefinition(def: VariableDefinition | undefined): {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    color?: string;
} {
    if (!def || def.type !== 'number') return {};
    return {
        defaultValue: def.defaultValue as number,
        min: def.min,
        max: def.max,
        step: def.step,
        ...(def.color ? { color: def.color } : {}),
    };
}

/**
 * Get cloze input props for InlineClozeInput from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
/**
 * Get cloze choice props for InlineClozeChoice from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function choicePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Get toggle props for InlineToggle from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function togglePropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function clozePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
    caseSensitive?: boolean;
} {
    if (!def || def.type !== 'text') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
        ...(def.caseSensitive !== undefined ? { caseSensitive: def.caseSensitive } : {}),
    };
}

/**
 * Get spot-color props for InlineSpotColor from a variable definition.
 * Extracts the `color` field.
 *
 * @example
 * <InlineSpotColor
 *     varName="radius"
 *     {...spotColorPropsFromDefinition(getVariableInfo('radius'))}
 * >
 *     radius
 * </InlineSpotColor>
 */
export function spotColorPropsFromDefinition(def: VariableDefinition | undefined): {
    color: string;
} {
    return {
        color: def?.color ?? '#8B5CF6',
    };
}

/**
 * Get linked-highlight props for InlineLinkedHighlight from a variable definition.
 * Extracts the `color` and `bgColor` fields.
 *
 * @example
 * <InlineLinkedHighlight
 *     varName="activeHighlight"
 *     highlightId="radius"
 *     {...linkedHighlightPropsFromDefinition(getVariableInfo('activeHighlight'))}
 * >
 *     radius
 * </InlineLinkedHighlight>
 */
export function linkedHighlightPropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    return {
        ...(def?.color ? { color: def.color } : {}),
        ...(def?.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Build the `variables` prop for FormulaBlock from variable definitions.
 *
 * Takes an array of variable names and returns the config map expected by
 * `<FormulaBlock variables={...} />`.
 *
 * @example
 * import { scrubVarsFromDefinitions } from './variables';
 *
 * <FormulaBlock
 *     latex="\scrub{mass} \times \scrub{accel}"
 *     variables={scrubVarsFromDefinitions(['mass', 'accel'])}
 * />
 */
export function scrubVarsFromDefinitions(
    varNames: string[],
): Record<string, { min?: number; max?: number; step?: number; color?: string }> {
    const result: Record<string, { min?: number; max?: number; step?: number; color?: string }> = {};
    for (const name of varNames) {
        const def = variableDefinitions[name];
        if (!def) continue;
        result[name] = {
            ...(def.min !== undefined ? { min: def.min } : {}),
            ...(def.max !== undefined ? { max: def.max } : {}),
            ...(def.step !== undefined ? { step: def.step } : {}),
            ...(def.color ? { color: def.color } : {}),
        };
    }
    return result;
}
