/**
 * Test fixture: Import statements
 */

// Default import
import React from "react";

// Named imports
import { useEffect, useState } from "react";

// Namespace import
import * as fs from "node:fs";

// Renamed import
import { readFile as read } from "node:fs";

// Type-only import
import type { FC } from "react";

// Inline type import
import { Component, type Props } from "./component";

// Side-effect import
import "./styles.css";

// Combined
import defaultExport, { named1, named2 as alias } from "module";
