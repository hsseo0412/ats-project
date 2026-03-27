<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * 모든 Repository 클래스의 기본 클래스
 *
 * 사용 예시:
 *
 * class UserRepository extends BaseRepository
 * {
 *     public function __construct(User $model)
 *     {
 *         parent::__construct($model);
 *     }
 * }
 */
abstract class BaseRepository
{
    public function __construct(protected Model $model)
    {
    }

    public function findById(int $id): ?Model
    {
        return $this->model->find($id);
    }

    public function findByIdOrFail(int $id): Model
    {
        return $this->model->findOrFail($id);
    }

    public function all(): Collection
    {
        return $this->model->all();
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Model
    {
        $model = $this->findByIdOrFail($id);
        $model->update($data);
        return $model->fresh();
    }

    public function delete(int $id): bool
    {
        return $this->findByIdOrFail($id)->delete();
    }
}
