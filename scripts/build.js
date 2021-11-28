import * as icons from "lucide-static"
import { resolve } from "path"
import * as fs from "fs"

const scriptTag = `<script>
  export let size = "100%";
  export let color = "currentColor";
  export let strokeWidth = "2";
  
  let customClass = "";
  export { customClass as class };
</script>
`;

/**
 * Replace width and height props with dynamic props
 * @param {string} iconSource iconSource 
 * @returns {string}
 */
function replaceProps(iconSource) {
	const widthRegex = /(^\s*width=)("[0-9]+")($)/gm;
	const heightRegex = /(^\s*height=)("[0-9]+")($)/gm;
	const colorRegex = /(^\s*stroke=)("[a-z0-9]+")($)/gmi;
	const strokeWidthRegex = /(^\s*stroke-width=)("[0-9]+")($)/gm;
	
	iconSource = iconSource.replace(widthRegex, "$1{size}$3");
	iconSource = iconSource.replace(heightRegex, "$1{size}$3");
	iconSource = iconSource.replace(colorRegex, "$1{color}$3");
	iconSource = iconSource.replace(strokeWidthRegex, "$1{strokeWidth}$3");
	
	return iconSource;
}


/**
 * Inject custom props into the svg component
 * @param {string} iconSource 
 * @returns {string}
 */
function injectProps(iconSource) {
	let lines = iconSource.split('\n');
	lines.splice(1, 0, `  class="lucide {customClass}"`);
	//lines.splice(1, 0, `  {...$$props}`);
	return lines.join("\n");
}


/**
 * Prepends the script tag to the svg
 * @param {string} iconSource 
 * @returns {string}
 */
function prependScriptTag(iconSource) {
	return scriptTag + iconSource
}


/**
 * Constructs the export directive for the es module file
 * @param {string} iconName 
 * @returns {string}
 */
function buildExportLine(iconName) {
	return `export { default as ${captialize(iconName)} } from "../${iconName}.svelte";\n`;
}


function captialize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}


// ------ Build Dist ------

let moduleSource = "";

const iconPath = resolve("./src/lib");

if (fs.existsSync(iconPath)) {
	fs.rmdirSync(iconPath, {recursive: true});
}
fs.mkdirSync(iconPath, {recursive: true});

for (const iconName in icons) {
	if (Object.hasOwnProperty.call(icons, iconName) && iconName !== "default") {
		let iconSource = icons[iconName];
		
		iconSource = injectProps(iconSource);
		iconSource = replaceProps(iconSource);
		iconSource = prependScriptTag(iconSource);
		
		fs.writeFileSync(resolve(iconPath, `${iconName}.svelte`), iconSource, {flag: "w+"});
		
		moduleSource += buildExportLine(iconName);
	}
}

const modPath = resolve("./src/lib/mod");

if (fs.existsSync(modPath)) {
	fs.rmdirSync(modPath, {recursive: true});
}
fs.mkdirSync(modPath, {recursive: true});

fs.writeFileSync(resolve(modPath, "index.js"), moduleSource, {flag: "w+"});
