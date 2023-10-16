export function CustomRelay() {
  return (
    <div className="rounded-xl bg-neutral-100 p-3 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
      <div className="flex items-start justify-between">
        <div>
          <h5 className="font-semibold">Personalize relay list</h5>
          <p className="text-sm">
            Lume offers some default relays for users who are not familiar with Nostr, but
            you can consider adding more relays to discover more content.
          </p>
        </div>
        <button
          type="button"
          className="mt-1 h-9 w-24 shrink-0 rounded-lg bg-neutral-200 font-medium hover:bg-blue-500 hover:text-white dark:bg-neutral-800"
        >
          Custom
        </button>
      </div>
    </div>
  );
}
