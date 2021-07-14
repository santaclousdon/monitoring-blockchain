import redis, {RetryStrategyOptions} from "redis"
import {MSG_REDIS_CONNECTION_ESTABLISHED, MSG_REDIS_DISCONNECTED} from "./msgs";
import {
    AlertKeysGitHubRepo,
    AlertKeysSystem,
    BaseChainKeys,
    ChainKeys,
    ComponentKeys,
    ConfigKeys,
    GitHubKeys,
    RedisHashes,
    RedisKeys,
    SystemKeys,
    UniqueKeys,
    ChainlinkNodeKeys,
    AlertKeysChainlinkNode,
} from "./types";
import {RedisClientNotInitialised} from "./errors";

export const baseChainsRedis = ['Cosmos', 'Substrate', 'Chainlink', 'General'];

export const getRedisHashes = (): RedisHashes => ({
    parent: 'hash_p1'
});

export const getUniqueKeys = (): UniqueKeys => ({
    mute: 'a1',
});

export const getSystemKeys = (): SystemKeys => ({
    process_cpu_seconds_total: 's1',
    process_memory_usage: 's2',
    virtual_memory_usage: 's3',
    open_file_descriptors: 's4',
    system_cpu_usage: 's5',
    system_ram_usage: 's6',
    system_storage_usage: 's7',
    network_transmit_bytes_per_second: 's8',
    network_receive_bytes_per_second: 's9',
    network_receive_bytes_total: 's10',
    network_transmit_bytes_total: 's11',
    disk_io_time_seconds_total: 's12',
    disk_io_time_seconds_in_interval: 's13',
    last_monitored: 's14',
    system_went_down_at: 's15',
});

export const getChainlinkKeys = (): ChainlinkNodeKeys => ({
    current_height: 'cl1',
    eth_blocks_in_queue: 'cl2',
    total_block_headers_received: 'cl3',
    total_block_headers_dropped: 'cl4',
    no_of_active_jobs: 'cl5',
    max_pending_tx_delay: 'cl6',
    process_start_time_seconds: 'cl7',
    total_gas_bumps: 'cl8',
    total_gas_bumps_exceeds_limit: 'cl9',
    no_of_unconfirmed_txs: 'cl10',
    total_errored_job_runs: 'cl11',
    current_gas_price_info: 'cl12',
    eth_balance_info: 'cl13',
    went_down_at_prometheus: 'cl14',
    last_prometheus_source_used: 'cl15',
    last_monitored_prometheus: 'cl16',
});

export const getGitHubKeys = (): GitHubKeys => ({
    no_of_releases: 'gh1',
    last_monitored: 'gh2',
});

export const getComponentKeys = (): ComponentKeys => ({
    heartbeat: 'c1'
});

export const getChainKeys = (): ChainKeys => ({
    mute_alerts: 'ch1'
});

export const getConfigKeys = (): ConfigKeys => ({
    config: 'conf1'
});

export const getAlertKeysSystem = (): AlertKeysSystem => ({
    open_file_descriptors: 'alert_system1',
    system_cpu_usage: 'alert_system2',
    system_storage_usage: 'alert_system3',
    system_ram_usage: 'alert_system4',
    system_is_down: 'alert_system5',
    metric_not_found: 'alert_system6',
    invalid_url: 'alert_system7',
});

export const getAlertKeysGitHubRepo = (): AlertKeysGitHubRepo => ({
    github_release: 'alert_github1',
    cannot_access_github: 'alert_github2',
});

export const getAlertKeysChainlinkNode = (): AlertKeysChainlinkNode => ({
    head_tacker_current_head: 'alert_cl_node1',
    head_tracker_heads_in_queue: 'alert_cl_node2',
    head_tracker_heads_received_total: 'alert_cl_node3',
    head_tracker_num_heads_dropped_total: 'alert_cl_node4',
    max_unconfirmed_blocks: 'alert_cl_node5',
    process_start_time_seconds: 'alert_cl_node6',
    tx_manager_gas_bump_exceeds_limit_total: 'alert_cl_node7',
    unconfirmed_transactions: 'alert_cl_node8',
    run_status_update_total: 'alert_cl_node9',
    eth_balance_amount: 'alert_cl_node10',
    eth_balance_amount_increase: 'alert_cl_node11',
    invalid_url: 'alert_cl_node12',
    metric_not_found: 'alert_cl_node13',
    node_is_down: 'alert_cl_node14',
    prometheus_is_down: 'alert_cl_node15',
});


export const getBaseChainKeys = (): BaseChainKeys => ({
    monitorables_info: 'bc1'
});

export const addPrefixToKeys =
    (keysObject: RedisKeys, prefix: string): RedisKeys => {
        const newObject: RedisKeys = {...keysObject};
        Object.keys(keysObject)
            .forEach((key) => {
                newObject[key] = `${prefix}${keysObject[key]}`;
            });
        return newObject;
    };

export const addPostfixToKeys =
    (keysObject: RedisKeys, postfix: string): RedisKeys => {
        const newObject: RedisKeys = {...keysObject};
        Object.keys(keysObject)
            .forEach((key) => {
                newObject[key] = `${keysObject[key]}${postfix}`;
            });
        return newObject;
    };

export class RedisInterface {
    private readonly host: string;
    private readonly port: number;
    private readonly db: number;
    private readonly password?: string;
    private _client?: redis.RedisClient;

    constructor(host: string = "localhost", port: number = 6379,
                db: number = 10, password?: string) {
        this.host = host;
        this.port = port;
        this.db = db;
        this.password = password;
        this._client = undefined;
    }

    get client() {
        return this._client
    }

    connect() {
        if (this._client && this._client.connected) {
            return;
        }
        this._client = redis.createClient({
            host: this.host,
            port: this.port,
            db: this.db,
            password: this.password,
            no_ready_check: true,
            retry_strategy: (_: RetryStrategyOptions) => {
                return undefined
            }
        });
        this._client.on('error', (error) => {
            console.error(error);
        });
        this._client.on('ready', () => {
            console.log(MSG_REDIS_CONNECTION_ESTABLISHED);
        });
        this._client.on('end', () => {
            console.error(MSG_REDIS_DISCONNECTED);
        });
        return;
    }

    disconnect() {
        if (this._client) {
            this._client.quit();
        } else {
            throw new RedisClientNotInitialised()
        }
    }

}
