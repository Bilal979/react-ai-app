export type Power = {
    name: string,
    description: string
}

export type PokAImon = {
    id: number,
    name: string,
    type?: string,
    powers: Power[],
    characteristics: string,
    image_url: string,
    doodle_source: string,
    like_count: number,
    action_images?: Record<string, string>

}

export type APIResponse<T> = {
    message: string,
    data: T,
    error?: any
}