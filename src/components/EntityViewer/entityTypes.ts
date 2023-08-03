export type Category = {
  id: number,
  name: string,
  icon: null,
  color: string
}

export type Preset = {
  id: number,
  categories: number[],
  title: string,
  icon: null
}

export type Keyword = {
  id: number,
  presets: string[],
  categories: (string | null)[],
  text: string
}
