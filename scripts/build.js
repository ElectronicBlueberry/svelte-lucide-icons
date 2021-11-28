import * as icons from "lucide-static"
import { resolve } from "path"
import * as fs from "fs"

const scriptTag = `<script>
  export let width = 24;
  export let height = 24;
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
	
	iconSource = iconSource.replace(widthRegex, "$1{width}$3");
	iconSource = iconSource.replace(heightRegex, "$1{height}$3");
	
	return iconSource;
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
	return `export { default as ${iconName} } from "./components/${iconName}.svelte";\n`;
}


// ------ Build Dist ------

let moduleSource = "";

const componentPath = resolve("./src/lib");

if (fs.existsSync(componentPath)) {
	fs.rmdirSync(componentPath, {recursive: true});
}
fs.mkdirSync(resolve("./src/lib"), {recursive: true});

for (const iconName in icons) {
	if (Object.hasOwnProperty.call(icons, iconName) && iconName !== "default") {
		let iconSource = icons[iconName];
		
		iconSource = replaceProps(iconSource);
		iconSource = prependScriptTag(iconSource);
		
		fs.writeFileSync(resolve(`./src/lib/${iconName}.svelte`), iconSource, {flag: "w+"});
		
		moduleSource += buildExportLine(iconName);
	}
}

//fs.writeFileSync("./dist/index.js", moduleSource, {flag: "w+"});
