export type ScopedEvent = {
  fetch: typeof fetch;
};

type Scoped<K> = (e: ScopedEvent) => K;

export interface ServiceProvider {
  // dateTime: IDateTimeProvider;
}
