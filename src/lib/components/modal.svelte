<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    onclose: () => void;
    children?: import("svelte").Snippet;
    header?: import("svelte").Snippet;
  }

  let { onclose, children, header }: Props = $props();

  let modal: HTMLDivElement | undefined = $state();
  let previouslyFocused: HTMLElement | null = $state(null);

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === "Escape") {
      onclose();
      return;
    }

    if (e.key === "Tab" && modal) {
      const nodes = modal.querySelectorAll("*");
      const tabbable = Array.from(nodes).filter(
        (n) => (n as HTMLElement).tabIndex >= 0
      ) as HTMLElement[];

      let index = tabbable.indexOf(document.activeElement as HTMLElement);
      if (index === -1 && e.shiftKey) index = 0;

      index += tabbable.length + (e.shiftKey ? -1 : 1);
      index %= tabbable.length;

      tabbable[index].focus();
      e.preventDefault();
    }
  }

  onMount(() => {
    previouslyFocused = document.activeElement as HTMLElement;

    return () => {
      if (previouslyFocused) {
        previouslyFocused.focus();
      }
    };
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<button
  type="button"
  class="modal-background"
  onclick={onclose}
  aria-label="Fermer le modal"
></button>

<div class="modal" role="dialog" aria-modal="true" bind:this={modal}>
  {#if header}
    {@render header()}
  {/if}
  <hr />
  {#if children}
    {@render children()}
  {/if}
  <hr />

  <button autofocus onclick={onclose}>Fermer</button>
</div>

<style>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    border: none;
    cursor: pointer;
  }

  .modal {
    position: absolute;
    left: 50%;
    top: 50%;
    width: calc(100vw - 4em);
    max-width: 32em;
    max-height: calc(100vh - 4em);
    overflow: auto;
    transform: translate(-50%, -50%);
    padding: 1em;
    border-radius: 0.2em;
    background: white;
  }

  button {
    display: block;
  }
</style>
