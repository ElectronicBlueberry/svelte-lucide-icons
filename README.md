# lucide-icons-svelte

This package is still in alpha! Use at your own risk.

An unofficial port of [Lucide](https://github.com/lucide-icons/lucide) icons.  
Lucide is a branch of feather icons.

## Usage

### Install

`npm install --save-dev lucide-icons-svelte`

### Import as component

```svelte
<script>
    import SearchIcon from "lucide-icons-svelte/search.svelte"
</script>

<SearchIcon />
```

You can also use named imports:

`import { Search } from "lucide-icons-svelte"`

This is however **not recommended**, as it will lead to massive performance issues while in dev mode in SvelteKit.

### Props

The following props are available:

* `class` All icons have the `"lucide"` class by default
* `size` Sets width and height
* `color`
* `strokeWidth`

## Compiling

Clone this repo, run `npm install` and then `npm run build`
