import { useState, useEffect } from 'react';

const initialFilters = {
  hideDecomissioned: true,
  hideZeroBalances: false,
  hideZeroVaultBalances: false,
};

const FILTERS = 'filteredPools';

const useFilteredPools = (pools, tokens) => {
  const [filteredPools, setFilteredPools] = useState(pools);

  let storedFilters;

  if (localStorage) {
    try {
      storedFilters = JSON.parse(localStorage.getItem(FILTERS));
    } catch (e) {
    }
  }

  const [filters, setFilters] = useState(storedFilters ? storedFilters : initialFilters);

  const toggleFilter = key => {
    const newFilters = { ...filters };
    newFilters[key] = !filters[key];
    setFilters(newFilters);
  };

  useEffect(() => {
    try {
      localStorage.setItem(FILTERS, JSON.stringify(filters));
    } catch (e) {
    }
  }, [filters]);

  useEffect(() => {
    let newPools = [...pools];

    if (filters.hideZeroBalances) {
      newPools = hideZeroBalances(newPools, tokens);
    }

    if (filters.hideZeroVaultBalances) {
      newPools = hideZeroVaultBalances(newPools, tokens);
    }

    // Show all vaults to new users
    if (newPools.length === 0) {
      newPools = [...pools];
    }

    if (filters.hideDecomissioned) {
      newPools = hideDecomissioned(newPools);
    }

    setFilteredPools(newPools);
  }, [pools, tokens, filters]);

  return { filteredPools, toggleFilter, filters };
};

function hideDecomissioned(pools) {
  return pools.filter(pool => {
    return pool.status !== 'eol' && pool.status !== 'refund';
  });
}

function hideZeroBalances(pools, tokens) {
  return pools.filter(pool => {
    if (tokens[pool.token]) {
      if (tokens[pool.token].tokenBalance > 1e14) {
        return true;
      }
    }

    if (tokens[pool.earnedToken]) {
      if (tokens[pool.earnedToken].tokenBalance > 1e14) {
        return true;
      }
    }

    return false;
  });
}

function hideZeroVaultBalances(pools, tokens) {
  return pools.filter(pool => {
    if (tokens[pool.earnedToken]) {
      if (tokens[pool.earnedToken].tokenBalance > 0) {
        return true;
      }
    }

    return false;
  });
}

export default useFilteredPools;
