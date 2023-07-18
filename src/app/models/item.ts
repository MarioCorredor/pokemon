export interface Item {
    attributes: { name: string, url: string }[],
    category: { name: string, url: string },
    cost: number,
    effect_entries: { effect: string, language: { name: string, url: string }, short_effect: string }[],
    flavor_text_entries: {
        language: { name: string, rul: string },
        text: string,
        version_group: { name: string, url: string }
    }[],
    game_indices: {
        game_index: number,
        generation: {name:string, url:string}
    }[],
    held_by_pokemon: any[],
    id: number,
    machines: any[],
    name: string,
    names: {
        language: {name: string, url: string},
        name: string
    }[],
    sprites: {default: string}
}