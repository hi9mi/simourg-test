import { http } from './http'

export type UserId = number
export type UserStatus = 'active' | 'blocked'

export interface User {
  id: UserId
  fullName: string
  email: string
  status: UserStatus
  registeredAt: string
}

export interface Paginated<T> {
  items: T[]
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
}

export interface UsersQuery {
  page: number
  limit: number
  search?: string
}

export interface CreateUserDto {
  fullName: string
  email: string
  status: UserStatus
  registeredAt: string
}

export type UpdateUserDto = Partial<CreateUserDto>

export async function getUsers(q: UsersQuery, { signal }: { signal?: AbortSignal }): Promise<Paginated<User>> {
  const { page, limit, search = '' } = q

  const params: Record<string, any> = {
    _page: page,
    _limit: limit,
    _sort: 'id',
    _order: 'asc',
  }

  if (search.trim())
    params.q = search.trim()

  const response = await http.get<User[]>('/users', { params, signal })

  const totalItems = Number(response.headers['x-total-count'] ?? 0) || response.data.length
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))

  return {
    items: response.data,
    page,
    limit,
    totalItems,
    totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  }
}

export async function getUser(id: UserId) {
  const { data } = await http.get<User>(`/users/${id}`)
  return data
}

export async function createUser(dto: CreateUserDto) {
  const { data } = await http.post<User>('/users', dto)
  return data
}

export async function updateUser(id: UserId, dto: UpdateUserDto) {
  const { data } = await http.patch<User>(`/users/${id}`, dto)
  return data
}
