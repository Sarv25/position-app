<script>
    import '../app.postcss'
    import { base } from '$app/paths'
</script>

<div class="navbar bg-base-300">
    <a
        class="btn btn-ghost text-xl"
        href="{base}/"
    >
        Home
    </a>
    <a
        class="btn btn-ghost text-xl"
        href="{base}/about"
    >
        About
    </a>
</div>

<main class="max-w-[1920px] container mx-auto space-y-4 md:m-4">
    <slot />
</main>
