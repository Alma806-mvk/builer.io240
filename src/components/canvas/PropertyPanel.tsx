import React from "react";
import { CanvasItem } from "../../types";

interface PropertyPanelProps {
  selectedItem: CanvasItem | null;
  onUpdateProperty: (
    id: string,
    property: keyof CanvasItem,
    value: any,
  ) => void;
  presetColors: string[];
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedItem,
  onUpdateProperty,
  presetColors,
}) => {
  if (!selectedItem) return null;

  const updateProp = (property: keyof CanvasItem, value: any) => {
    onUpdateProperty(selectedItem.id, property, value);
  };

  const ColorSwatch: React.FC<{
    color: string;
    selectedColor?: string;
    onClick: (color: string) => void;
  }> = ({ color, selectedColor, onClick }) => (
    <button
      type="button"
      onClick={() => onClick(color)}
      className={`w-5 h-5 rounded-md border-2 transition-all ${
        selectedColor === color
          ? "ring-2 ring-offset-1 ring-offset-slate-800 ring-sky-400 border-sky-400"
          : "border-slate-600 hover:border-slate-400 hover:scale-110"
      }`}
      style={{ backgroundColor: color }}
      aria-label={`Color ${color}`}
      aria-pressed={selectedColor === color}
    />
  );

  const renderTextProperties = () => {
    if (
      !["textElement", "stickyNote", "commentElement"].includes(
        selectedItem.type,
      )
    )
      return null;

    return (
      <>
        {/* Text Color */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">Text:</label>
          {presetColors.slice(0, 8).map((color) => (
            <ColorSwatch
              key={`text-${color}`}
              color={color}
              selectedColor={selectedItem.textColor}
              onClick={(c) => updateProp("textColor", c)}
            />
          ))}
        </div>

        {/* Font Family */}
        <select
          value={selectedItem.fontFamily || "Inter"}
          onChange={(e) => updateProp("fontFamily", e.target.value)}
          className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
        >
          <option value="Inter">Inter</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Helvetica">Helvetica</option>
        </select>

        {/* Font Size */}
        <input
          type="number"
          value={parseInt(selectedItem.fontSize || "14")}
          onChange={(e) =>
            updateProp("fontSize", `${Math.max(8, parseInt(e.target.value))}px`)
          }
          className="w-14 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          title="Font Size (px)"
          min="8"
          max="72"
        />

        {/* Font Weight */}
        <div className="flex gap-1 bg-slate-700 p-0.5 rounded-md border border-slate-600">
          <button
            onClick={() =>
              updateProp(
                "fontWeight",
                selectedItem.fontWeight === "bold" ? "normal" : "bold",
              )
            }
            className={`px-2 py-1 text-xs rounded transition-colors ${
              selectedItem.fontWeight === "bold"
                ? "bg-sky-600 text-white"
                : "text-slate-300 hover:bg-slate-600"
            }`}
          >
            B
          </button>
          <button
            onClick={() =>
              updateProp(
                "fontStyle",
                selectedItem.fontStyle === "italic" ? "normal" : "italic",
              )
            }
            className={`px-2 py-1 text-xs rounded transition-colors ${
              selectedItem.fontStyle === "italic"
                ? "bg-sky-600 text-white"
                : "text-slate-300 hover:bg-slate-600"
            }`}
          >
            I
          </button>
          <button
            onClick={() =>
              updateProp(
                "textDecoration",
                selectedItem.textDecoration === "underline"
                  ? "none"
                  : "underline",
              )
            }
            className={`px-2 py-1 text-xs rounded transition-colors ${
              selectedItem.textDecoration === "underline"
                ? "bg-sky-600 text-white"
                : "text-slate-300 hover:bg-slate-600"
            }`}
          >
            U
          </button>
        </div>

        {/* Text Alignment */}
        <div className="flex gap-1 bg-slate-700 p-0.5 rounded-md border border-slate-600">
          {["left", "center", "right"].map((align) => (
            <button
              key={align}
              onClick={() => updateProp("textAlign", align)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                selectedItem.textAlign === align
                  ? "bg-sky-600 text-white"
                  : "text-slate-300 hover:bg-slate-600"
              }`}
            >
              {align === "left" ? "⇤" : align === "center" ? "≡" : "⇥"}
            </button>
          ))}
        </div>
      </>
    );
  };

  const renderCodeProperties = () => {
    if (selectedItem.type !== "codeBlock") return null;

    return (
      <>
        {/* Language */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">Language:</label>
          <select
            value={selectedItem.codeLanguage || "javascript"}
            onChange={(e) => updateProp("codeLanguage", e.target.value)}
            className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="javascript">🟨 JavaScript</option>
            <option value="typescript">🔷 TypeScript</option>
            <option value="python">🐍 Python</option>
            <option value="java">☕ Java</option>
            <option value="cpp">⚡ C++</option>
            <option value="html">🌐 HTML</option>
            <option value="css">🎨 CSS</option>
          </select>
        </div>

        {/* Theme */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">Theme:</label>
          <select
            value={selectedItem.codeTheme || "dark"}
            onChange={(e) => updateProp("codeTheme", e.target.value)}
            className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="dark">🌙 Dark</option>
            <option value="light">☀️ Light</option>
            <option value="github">🐱 GitHub</option>
            <option value="vscode">🔵 VS Code</option>
          </select>
        </div>

        {/* Options */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">
            <input
              type="checkbox"
              checked={selectedItem.codeShowLineNumbers || false}
              onChange={(e) =>
                updateProp("codeShowLineNumbers", e.target.checked)
              }
              className="mr-1.5 text-sky-500 focus:ring-sky-500"
            />
            Line Numbers
          </label>
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">
            <input
              type="checkbox"
              checked={selectedItem.codeShowCopyButton || false}
              onChange={(e) =>
                updateProp("codeShowCopyButton", e.target.checked)
              }
              className="mr-1.5 text-sky-500 focus:ring-sky-500"
            />
            Copy Button
          </label>
        </div>
      </>
    );
  };

  const renderConnectorProperties = () => {
    if (selectedItem.type !== "connectorElement") return null;

    return (
      <>
        {/* Connector Type */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">Type:</label>
          <select
            value={selectedItem.connectorType || "straight"}
            onChange={(e) => updateProp("connectorType", e.target.value)}
            className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="straight">━ Straight</option>
            <option value="curved">〜 Curved</option>
            <option value="elbow">⅃ Elbow</option>
          </select>
        </div>

        {/* Line Style */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">Style:</label>
          <select
            value={selectedItem.connectorStyle || "solid"}
            onChange={(e) => updateProp("connectorStyle", e.target.value)}
            className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="solid">▬ Solid</option>
            <option value="dashed">▭ Dashed</option>
            <option value="dotted">⋯ Dotted</option>
          </select>
        </div>

        {/* Thickness */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">Thickness:</label>
          <select
            value={selectedItem.connectorThickness || 2}
            onChange={(e) =>
              updateProp("connectorThickness", parseInt(e.target.value))
            }
            className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value={1}>1px</option>
            <option value={2}>2px</option>
            <option value={3}>3px</option>
            <option value={4}>4px</option>
            <option value={6}>6px</option>
          </select>
        </div>

        {/* Arrows */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">
            <input
              type="checkbox"
              checked={selectedItem.connectorArrowEnd !== false}
              onChange={(e) =>
                updateProp("connectorArrowEnd", e.target.checked)
              }
              className="mr-1.5 text-sky-500 focus:ring-sky-500"
            />
            → End Arrow
          </label>
        </div>

        {/* Animation */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">Animation:</label>
          <select
            value={selectedItem.connectorAnimation || "none"}
            onChange={(e) => updateProp("connectorAnimation", e.target.value)}
            className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="none">None</option>
            <option value="flow">→ Flow</option>
            <option value="pulse">◯ Pulse</option>
            <option value="glow">✨ Glow</option>
          </select>
        </div>
      </>
    );
  };

  const renderChartProperties = () => {
    if (selectedItem.type !== "chart") return null;

    return (
      <>
        {/* Chart Type */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">Type:</label>
          <select
            value={selectedItem.chartType || "bar"}
            onChange={(e) => updateProp("chartType", e.target.value)}
            className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="bar">📊 Bar Chart</option>
            <option value="line">📈 Line Chart</option>
            <option value="pie">🥧 Pie Chart</option>
            <option value="area">📈 Area Chart</option>
          </select>
        </div>

        {/* Chart Title */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">Title:</label>
          <input
            type="text"
            value={selectedItem.chartTitle || ""}
            onChange={(e) => updateProp("chartTitle", e.target.value)}
            className="w-24 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Chart Title"
          />
        </div>

        {/* Color Scheme */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">Colors:</label>
          <select
            value={selectedItem.chartColorScheme || "blue"}
            onChange={(e) => updateProp("chartColorScheme", e.target.value)}
            className="p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="blue">🔵 Blue</option>
            <option value="green">🟢 Green</option>
            <option value="purple">🟣 Purple</option>
            <option value="red">🔴 Red</option>
            <option value="orange">🟠 Orange</option>
          </select>
        </div>

        {/* Show Grid */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">
            <input
              type="checkbox"
              checked={selectedItem.chartShowGrid !== false}
              onChange={(e) => updateProp("chartShowGrid", e.target.checked)}
              className="mr-1.5 text-sky-500 focus:ring-sky-500"
            />
            Show Grid
          </label>
        </div>
      </>
    );
  };

  const renderCommonProperties = () => {
    return (
      <>
        {/* Background Color */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">Background:</label>
          {presetColors.slice(0, 8).map((color) => (
            <ColorSwatch
              key={`bg-${color}`}
              color={color}
              selectedColor={selectedItem.backgroundColor}
              onClick={(c) => updateProp("backgroundColor", c)}
            />
          ))}
        </div>

        {/* Border */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">Border:</label>
          {presetColors.slice(0, 6).map((color) => (
            <ColorSwatch
              key={`border-${color}`}
              color={color}
              selectedColor={selectedItem.borderColor}
              onClick={(c) => updateProp("borderColor", c)}
            />
          ))}
          <input
            type="number"
            value={parseInt(selectedItem.borderWidth || "1")}
            onChange={(e) =>
              updateProp(
                "borderWidth",
                `${Math.max(0, parseInt(e.target.value))}px`,
              )
            }
            className="w-14 p-1.5 bg-slate-700 rounded-md border border-slate-600 text-slate-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            title="Border Width (px)"
            min="0"
            max="10"
          />
        </div>

        {/* Opacity */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-300 mr-1">Opacity:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={selectedItem.opacity || 1}
            onChange={(e) => updateProp("opacity", parseFloat(e.target.value))}
            className="w-16"
          />
          <span className="text-xs text-slate-400">
            {Math.round((selectedItem.opacity || 1) * 100)}%
          </span>
        </div>
      </>
    );
  };

  return (
    <div className="p-3 bg-slate-800/70 border-b border-slate-700 flex flex-wrap items-center gap-x-4 gap-y-3 text-xs shadow-inner">
      <span className="font-semibold text-sky-400 mr-2 text-sm">
        Properties: {selectedItem.type}
      </span>

      {renderTextProperties()}
      {renderCodeProperties()}
      {renderConnectorProperties()}
      {renderChartProperties()}
      {renderCommonProperties()}
    </div>
  );
};

export default PropertyPanel;
