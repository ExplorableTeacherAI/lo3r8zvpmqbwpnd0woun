import { type ReactElement } from "react";

// Initialize variables and their colors from this file's variable definitions
import { useVariableStore, initializeVariableColors } from "@/stores";
import { getDefaultValues, variableDefinitions } from "./variables";
useVariableStore.getState().initialize(getDefaultValues());
initializeVariableColors(variableDefinitions);

// Import section blocks
import { circlesAndPiBlocks } from "./sections/CirclesAndPi";

/**
 * ------------------------------------------------------------------
 * BLOCK CONFIGURATION
 * ------------------------------------------------------------------
 * This file is the entry point for your lesson content.
 *
 * LESSON: Discovering Pi - Circles and Pi
 * TARGET: Secondary school (ages 13-17)
 * OBJECTIVE: Understand what Pi is and where it comes from
 *
 * ------------------------------------------------------------------
 */

export const blocks: ReactElement[] = [
    ...circlesAndPiBlocks,
];
