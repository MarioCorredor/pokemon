export interface Move {
    name: string,
    id: string,
    accuracy: string,
    power: number,
    pp: number,
    priority: number,
    stat_changes: {change: number, stat:{name: string}}[],
    effect_chance: string,
    effect_entries: {effect: string}[],
    contest_type: {name: string, url: string},
    damage_class : {name: string, url: string},
    generation: {name: string, url: string},
    learned_by_pokemon: {name: string, url: string}[],
    type: {name: string, url: string},
    flavor_text_entries:  {flavor_text: string, language: {name: string, url: string}, version_group: {name: string, url: string} }[]
}